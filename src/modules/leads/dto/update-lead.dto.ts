import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  IsEnum,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { LeadCourseCategory } from '../entities/lead-enums';

export class UpdateLeadDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, { message: 'El teléfono solo puede contener números' })
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  nameCourse?: string;

  @IsOptional()
  @IsEnum(LeadCourseCategory, {
    message: 'La categoría del curso no es válida',
  })
  categoryCourse?: LeadCourseCategory;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  branchId?: string;

  @IsOptional()
  @IsDateString()
  nextContactDate?: string;
}
