import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { LeadCourseCategory } from '../entities/lead-enums';

export class CreateLeadManualDto {
  @IsString()
  name: string;

  @IsString()
  @Matches(/^\d+$/, { message: 'El teléfono solo puede contener números' })
  phone: string;

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
  @IsUUID()
  branchId?: string;

  @IsOptional()
  @IsUUID()
  assignedToId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
