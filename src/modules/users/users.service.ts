import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRoles } from 'src/constants/Roles.enum';
import { CreateCommercialDto } from './dto/create-commercial.dto.';
import * as bcrypt from 'bcryptjs';
import { Contract } from '../contracts/entities/contract.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticatedUser } from 'src/interfaces/authenticated-user.interface';
import { formatText } from 'src/utils/string-utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
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

    const formatName = formatText(firstName);
    const formatLastName = formatText(lastName);
    // Crear y guardar el nuevo usuario en la base de datos
    const newUser = this.usersRepository.create({
      firstName: formatName,
      lastName: formatLastName,
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
    const where: any = {
      role: In([UserRoles.COMMERCIAL, UserRoles.COMMERCIAL_PLUS]), // Filtrar por múltiples roles
    };

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

  async getUsersWithContracts(
    currentMonth: number,
    currentYear: number,
  ): Promise<User[]> {
    // Obtener todos los contratos con la relación 'user'
    const usersWithContracts = await this.contractRepository
      .createQueryBuilder('contract')
      .leftJoinAndSelect('contract.user', 'user') // Unimos la entidad 'user'
      .where('EXTRACT(MONTH FROM contract.createdAt) = :month', {
        month: currentMonth,
      })
      .andWhere('EXTRACT(YEAR FROM contract.createdAt) = :year', {
        year: currentYear,
      })
      .getMany();

    // Usamos un Map o Set para asegurarnos de que cada usuario sea único
    const uniqueUsersMap = new Map();
    usersWithContracts.forEach((contract) => {
      if (!uniqueUsersMap.has(contract.user.id)) {
        uniqueUsersMap.set(contract.user.id, contract.user); // Guardamos el usuario en el Map si no está
      }
    });

    // Convertimos el Map a un array de usuarios únicos
    const uniqueUsers = Array.from(uniqueUsersMap.values());

    return uniqueUsers;
  }

  async getUsersActiveForMonth(): Promise<User[]> {
    // Obtener todos los usuarios activos (sin filtrarlos por contratos o fechas)
    const users = await this.usersRepository.find({
      where: {
        active: true,
        role: In([UserRoles.COMMERCIAL, UserRoles.COMMERCIAL_PLUS]), // Filtrar por múltiples roles
      },
    }); // Este método traerá todos los usuarios activos de la base de datos

    // Temporalmente desactivamos a tatiana

    const tatiana = users.find(
      (user) => user.email === 'lauradiaz@esmeraschool.com',
    );

    // ahora sacamos a tatiana del array

    if (tatiana) {
      users.splice(users.indexOf(tatiana), 1);
    }

    return users;
  }
  async updateUser(
    updateUserData: UpdateUserDto,
    user: AuthenticatedUser,
  ): Promise<User> {
    // Busca el usuario por ID desde el token
    const existingUser = await this.usersRepository.findOne({
      where: { id: user.id },
    });
    if (!existingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Formatear el nombre y apellido antes de actualizarlos
    if (updateUserData.firstName) {
      updateUserData.firstName = formatText(updateUserData.firstName);
    }

    if (updateUserData.lastName) {
      updateUserData.lastName = formatText(updateUserData.lastName);
    }
    // Actualiza solo los campos permitidos
    Object.assign(existingUser, updateUserData);
    // Guarda los cambios en la base de datos
    await this.usersRepository.save(existingUser);

    delete existingUser.active;
    delete existingUser.role;
    delete existingUser.id;
    delete existingUser.createdAt;

    return existingUser;
  }
}
