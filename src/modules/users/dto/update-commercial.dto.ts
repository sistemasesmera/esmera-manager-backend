import { IsString, MinLength } from 'class-validator';

export class UpdateCommercialPasswordDto {
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  newPassword: string;
}
