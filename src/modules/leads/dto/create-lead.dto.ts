import { IsEmail, IsOptional, IsString, Matches, IsIn } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  name: string;

  @IsString()
  @Matches(/^\d+$/, { message: 'El teléfono solo puede contener números' }) // Solo números
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  nameCourse?: string;

  @IsOptional()
  @IsString()
  @IsIn(
    [
      'ESTETICA',
      'PELUQUERIA',
      'MAQUILLAJE',
      'BARBERIA',
      'UÑAS',
      'CEJASYPESTANAS',
      'SIN GESTION',
    ],
    {
      message:
        'La categoría del curso debe ser una de las siguientes opciones: Estetica, Peluqueria, Maquillaje, Barberia, Uñas',
    },
  )
  categoryCourse?: string;
}
