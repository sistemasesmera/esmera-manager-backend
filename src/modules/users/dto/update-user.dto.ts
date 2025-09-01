import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
  IsEmail,
  IsUUID,
  IsIn,
} from 'class-validator';

const namePattern = /^[A-Za-zÀ-ÿ\s\-']+$/;

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50, { message: 'El nombre no puede superar los 50 caracteres' })
  @Matches(namePattern, {
    message: 'El nombre contiene caracteres no permitidos.',
  })
  firstName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50, { message: 'El apellido no puede superar los 50 caracteres' })
  @Matches(namePattern, {
    message: 'El apellido contiene caracteres no permitidos.',
  })
  lastName?: string;

  @IsOptional()
  @IsString()
  @IsIn(['COMERCIAL', 'COMERCIAL_PLUS'], {
    message: 'El rol debe ser COMERCIAL o COMERCIAL_PLUS',
  })
  role?: string;

  @IsOptional()
  @IsUUID('4', { message: 'El branchId debe ser un UUID válido' })
  branchId?: string;
}
