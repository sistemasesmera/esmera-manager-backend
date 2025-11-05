import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRoles } from 'src/constants/Roles.enum';
import { CreateCommercialDto } from './dto/create-commercial.dto.';
import * as bcrypt from 'bcryptjs';
import { Contract } from '../contracts/entities/contract.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { formatText } from 'src/utils/string-utils';
import { Branch } from '../branch/entities/branch.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
  ) {}

  // Busca a un Usuario por Email (Se utiliza en el jwtStrategy)
  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    delete user.password;
    return user;
  }

  //Crear un comercial
  async createCommercial(createCommercialDto: CreateCommercialDto) {
    const { firstName, lastName, email, password, role, branchId, username } =
      createCommercialDto;

    if (role === 'ADMIN') {
      throw new ConflictException('No se puede crear un usuario administrador');
    }
    // Verificar si el correo ya está en uso
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('El correo ya se encuentra en uso');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const normalizedEmail = email.toLowerCase();
    const formatName = formatText(firstName);
    const formatLastName = formatText(lastName);

    // Verificar que la branch exista
    const branch = await this.branchRepository.findOne({
      where: { id: branchId },
    });
    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    // Crear el usuario
    const newUser = this.usersRepository.create({
      firstName: formatName,
      lastName: formatLastName,
      email: normalizedEmail,
      password: hashedPassword,
      username: username.trim().toLowerCase(),
      role,
      branch,
    });

    await this.usersRepository.save(newUser);

    delete newUser.password; // No devolver la contraseña
    return newUser;
  }

  // Trae a todos los comerciales (Paginados)
  async getCommercials(
    page: number = 1,
    limit: number = 5,
    active?: number,
    searchTerm?: string,
  ) {
    const skip = (page - 1) * limit;

    const qb = this.usersRepository.createQueryBuilder('user');

    qb.leftJoinAndSelect('user.branch', 'branch');

    // Filtrar por roles comerciales
    qb.where('user.role IN (:...roles)', {
      roles: [UserRoles.COMMERCIAL, UserRoles.COMMERCIAL_PLUS],
    });

    // Filtro opcional por estado
    if (active !== undefined) {
      qb.andWhere('user.active = :active', { active: active === 1 });
    }

    // Filtro opcional por searchTerm (nombre, apellido, full name o email)
    if (searchTerm) {
      qb.andWhere(
        `(LOWER(user.firstName) LIKE :search OR
          LOWER(user.lastName) LIKE :search OR
          LOWER(CONCAT(user.firstName, ' ', user.lastName)) LIKE :search OR
          LOWER(user.email) LIKE :search)`,
        { search: `%${searchTerm.toLowerCase()}%` },
      );
    }

    // Orden descendente por fecha de creación
    qb.orderBy('user.createdAt', 'DESC');

    // Paginación
    qb.take(limit).skip(skip);

    const [commercials, total] = await qb.getManyAndCount();

    return {
      data: commercials,
      count: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCommercialsSelect() {
    return await this.usersRepository.find({
      where: [
        { role: UserRoles.COMMERCIAL },
        { role: UserRoles.COMMERCIAL_PLUS },
      ],
      order: {
        active: 'DESC', // Activos primero
        createdAt: 'ASC', // Orden alfabético dentro de cada grupo
      },
      select: ['id', 'firstName', 'lastName', 'active', 'role'], // Solo los campos que necesitas
    });
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
      relations: ['branch'],
    }); // Este método traerá todos los usuarios activos de la base de datos

    return users;
  }

  async updatePartial(id: string, partialUpdateDto: UpdateUserDto) {
    const commercial = await this.usersRepository.findOne({
      where: { id },
      relations: ['branch'],
    });

    if (!commercial) {
      throw new NotFoundException('Comercial no encontrado');
    }

    // Validación de email duplicado
    if (partialUpdateDto.email) {
      const existing = await this.usersRepository.findOne({
        where: { email: partialUpdateDto.email },
      });

      if (existing && existing.id !== id) {
        throw new BadRequestException('Ya existe un usuario con este email');
      }
    }

    // Si viene branchId, cargamos la entidad y la asignamos
    if (partialUpdateDto.branchId) {
      const branch = await this.branchRepository.findOneBy({
        id: partialUpdateDto.branchId,
      });

      if (!branch) {
        throw new NotFoundException('Sede no encontrada');
      }

      commercial.branch = branch;
      delete partialUpdateDto.branchId;
    }

    // Merge del resto de campos (firstName, lastName, email, role)
    Object.assign(commercial, partialUpdateDto);

    return this.usersRepository.save(commercial);
  }

  async changeCommercialPassword(
    id: string,
    newPassword: string,
  ): Promise<User> {
    const commercial = await this.usersRepository.findOne({ where: { id } });
    if (!commercial) {
      throw new NotFoundException('Comercial no encontrado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    commercial.password = hashedPassword;

    return this.usersRepository.save(commercial);
  }

  async updateOwnData(
    userId: string,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const allowedFields: (keyof UpdateUserDto)[] = [
      'firstName',
      'lastName',
      'email',
    ];
    for (const key of Object.keys(updateUserDto)) {
      if (allowedFields.includes(key as keyof UpdateUserDto)) {
        user[key] = updateUserDto[key];
      }
    }

    await this.usersRepository.save(user);
    return user;
  }
}
