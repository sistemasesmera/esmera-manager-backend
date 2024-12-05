// src/modules/dashboard/dto/update-common-goal.dto.ts
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateCommonGoalDto {
  @IsNumber()
  @IsPositive()
  commonGoal: number;
  @IsNumber()
  @IsPositive()
  contractsComercialGoal: number;
}
