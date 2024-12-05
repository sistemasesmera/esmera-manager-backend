// src/modules/dashboard/dto/update-common-goal.dto.ts
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateCommonGoalDto {
  @IsNumber()
  @IsPositive()
  commonGoalAmount: number;
  @IsNumber()
  @IsPositive()
  commonGoalContracts: number;
}
