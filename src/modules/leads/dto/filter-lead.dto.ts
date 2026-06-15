import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  Min,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { LeadStatus, LeadSource } from '../entities/lead-enums';

export class FilterLeadDto {
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

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @IsOptional()
  @IsUUID()
  branchId?: string;

  @IsOptional()
  @IsUUID()
  assignedToId?: string;

  @IsOptional()
  @IsEnum(LeadSource)
  source?: LeadSource;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  unassigned?: boolean;
}
