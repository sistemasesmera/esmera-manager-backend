import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  IsUUID,
} from 'class-validator';
import { UserRoles } from 'src/constants/Roles.enum';

export class CreateCommercialDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  firstName: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString()
  lastName: string;

  @IsEmail({}, { message: 'Debe ser un correo válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString()
  @Length(6, 100, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsEnum(UserRoles, { message: 'Rol inválido' })
  role: UserRoles;

  @IsUUID('4', { message: 'Sede inválida' })
  branchId: string;
}
