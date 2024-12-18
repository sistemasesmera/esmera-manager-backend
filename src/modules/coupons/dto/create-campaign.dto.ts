import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsDateString,
  Length,
} from 'class-validator';

export class CreateCampaignDto {
  // Código de la campaña (Debe estar entre 5 y 50 caracteres)
  @IsString()
  @Length(5, 50, {
    message: 'campaignCode must be between 5 and 50 characters long.',
  })
  campaignCode: string;

  // Monto del cupón (Debe ser un número entero mayor o igual a 1)
  @IsInt()
  @Min(1, { message: 'discountAmount must be a positive number.' })
  discountAmount: number;

  // Total de cupones (Debe ser un número entero mayor o igual a 1)
  @IsInt()
  @Min(1, { message: 'totalCoupons must be a positive number.' })
  totalCoupons: number;

  // Nombre del curso (Debe ser una cadena de texto no vacía)
  @IsString()
  @IsNotEmpty()
  courseName: string;

  // Fecha de expiración de la campaña (Debe ser una fecha válida en formato ISO 8601)
  @IsDateString()
  expirationDate: string; // Puede ser string o Date, dependiendo de cómo quieras manejar la fecha
}
