import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthenticatedUser } from 'src/interfaces/authenticated-user.interface';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, email, password, role } = createUserDto;
    //Validacion para que no se pueda crear usuarios admin
    if (role === 'ADMIN') {
      throw new ConflictException('Admin role is reserved');
    }

    // Verificar si el correo ya está en uso
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear y guardar el nuevo usuario en la base de datos
    const newUser = this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });
    await this.userRepository.save(newUser);

    delete newUser.password;
    return newUser;
  }

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ user: User; accessToken: string }> {
    const { email, password } = loginUserDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      email: user.email,
      role: user.role,
      id: user.id,
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      user,
      accessToken,
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'role',
        'firstName',
        'lastName',
        'active',
      ], // Incluye explícitamente el campo `password`
    });
    if (!user.active) {
      throw new UnauthorizedException('Usuario inactivo');
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password;
      return user;
    }
    return null;
  }
  async changePassword(
    user: AuthenticatedUser, // Usuario autenticado (por ejemplo, obtenido de JWT)
    changePasswordDto: ChangePasswordDto, // DTO que contiene las contraseñas
  ): Promise<{ message: string }> {
    const { oldPassword, newPassword, confirmPassword } = changePasswordDto;

    // Verificar que la nueva contraseña y la confirmación coinciden
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // Buscar el usuario en la base de datos
    const existingUser = await this.userRepository.findOne({
      where: { id: user.id },
      select: ['id', 'email', 'password'], // Incluye explícitamente el campo `password`
    });

    if (!existingUser) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificar que la contraseña actual (oldPassword) sea válida
    const isOldPasswordValid = await bcrypt.compare(
      oldPassword,
      existingUser.password,
    );

    if (!isOldPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    // Encriptar la nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña en la base de datos
    existingUser.password = hashedNewPassword;

    // Guardar el usuario con la nueva contraseña
    await this.userRepository.save(existingUser);

    return { message: 'Contraseña actualizada exitosamente' };
  }
}
