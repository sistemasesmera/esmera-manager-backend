import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
  // Nombre del curso (obligatorio)
  @IsString()
  @IsNotEmpty()
  name: string;
}
