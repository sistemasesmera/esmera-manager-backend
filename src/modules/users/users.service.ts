import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRoles } from 'src/constants/Roles.enum';
import { CreateCommercialDto } from './dto/create-commercial.dto.';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Busca a un Usuario por Email (Se utiliza en el jwtStrategy)
  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    delete user.password;
    return user;
  }

  //Crear un comercial
  async createCommercial(createCommercialDto: CreateCommercialDto) {
    const { firstName, lastName, email, password } = createCommercialDto;

    // Verificar si el correo ya está en uso
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Convertir el email a minúsculas
    const normalizedEmail = email.toLowerCase();
    // Crear y guardar el nuevo usuario en la base de datos
    const newUser = this.usersRepository.create({
      firstName,
      lastName,
      email: normalizedEmail,
      password: hashedPassword,
    });
    await this.usersRepository.save(newUser);

    delete newUser.password;
    return newUser;
  }

  // Trae a todos los comerciales (Paginados)
  async getCommercials(
    page: number = 1,
    limit: number = 5,
    email?: string,
    active?: number,
  ) {
    const skip = (page - 1) * limit;

    // Construye las condiciones dinámicamente según los filtros recibidos
    const where: any = { role: UserRoles.COMMERCIAL };

    // Si se proporciona el filtro de email, añade una condición de 'LIKE'
    if (email) {
      where.email = Like(`%${email}%`);
    }

    // Si se proporciona el filtro de estado (activo/inactivo), añádelo
    if (active !== undefined) {
      where.active = active === 1;
    }
    // Ejecuta la consulta con los filtros y paginación
    const [commercials, total] = await this.usersRepository.findAndCount({
      where,
      take: limit,
      skip,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: commercials,
      count: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Actualiza el estado de un comercial (Activo/Inactivo)
  async updateCommercialStatus(id: string, active: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Actualizar el estado activo del usuario
    user.active = active === 1; // Si active es 1, lo activamos; si es 0, lo desactivamos
    await user.save(); // Guardamos los cambios en la base de datos

    return user; // Retorna el usuario actualizado
  }
}
