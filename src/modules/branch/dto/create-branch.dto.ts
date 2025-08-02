// src/modules/branch/dto/create-branch.dto.ts
import { IsString, Length } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsString()
  @Length(5, 20)
  phone: string;

  @IsString()
  @Length(5, 200)
  address: string;
}
