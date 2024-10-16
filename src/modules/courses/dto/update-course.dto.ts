// update-course.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class UpdateCourseDto {
  @IsOptional() // Indica que este campo es opcional
  @IsString()
  name?: string; // Nombre del curso

  @IsOptional() // Indica que este campo es opcional
  @IsString()
  price?: string; // Precio del curso
}
