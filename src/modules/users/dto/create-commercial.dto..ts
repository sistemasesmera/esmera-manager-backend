import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateCommercialDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6) // Longitud mínima de 6 caracteres
  @Matches(/^.{6,}$/, {
    message: 'La contraseña debe tener mas de 6 caracteres.',
  })
  password: string;
}
