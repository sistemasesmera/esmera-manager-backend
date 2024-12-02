import { IsDateString, IsOptional, IsUUID } from 'class-validator';

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
}
