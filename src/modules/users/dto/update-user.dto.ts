import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';

// Expresión regular que permite solo letras, espacios, guiones y apóstrofes
const namePattern = /^[A-Za-zÀ-ÿ\s\-']+$/;

// DTO de actualización de usuario
export class UpdateUserDto {
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
}
