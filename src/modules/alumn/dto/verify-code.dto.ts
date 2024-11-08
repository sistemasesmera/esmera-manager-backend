import { IsNotEmpty, IsUUID } from 'class-validator';

export class VerifyCode {
  @IsNotEmpty()
  @IsUUID()
  alumnId: string;

  @IsNotEmpty()
  code: string;
}
