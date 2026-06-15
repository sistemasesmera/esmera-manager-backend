import { IsOptional, IsUUID } from 'class-validator';

export class StatsLeadDto {
  @IsOptional()
  @IsUUID()
  branchId?: string;

  @IsOptional()
  @IsUUID()
  assignedToId?: string;
}
