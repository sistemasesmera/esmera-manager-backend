import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class ReportFiltersDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string; // Fecha de fin (obligatoria)

  @IsOptional()
  @IsUUID('4', { message: 'El ID del curso debe ser un UUID válido.' })
  courseId?: string; // UUID del curso (opcional)

  @IsOptional()
  @IsUUID('4', { message: 'El ID del comercial debe ser un UUID válido.' })
  userId?: string; // UUID del comercial (opcional)

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1, { message: 'page must not be less than 1' })
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}
