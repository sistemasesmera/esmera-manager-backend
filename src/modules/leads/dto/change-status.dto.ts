import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LeadStatus, LeadDiscardReason } from '../entities/lead-enums';

export class ChangeLeadStatusDto {
  @IsEnum(LeadStatus)
  status: LeadStatus;

  @IsOptional()
  @IsEnum(LeadDiscardReason)
  discardReason?: LeadDiscardReason;

  @IsOptional()
  @IsString()
  discardReasonOther?: string;
}
