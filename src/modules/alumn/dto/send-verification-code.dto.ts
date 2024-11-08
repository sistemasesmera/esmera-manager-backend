import { IsNotEmpty, IsUUID } from 'class-validator';

export class SendVerificationCodeDto {
  @IsNotEmpty()
  @IsUUID()
  alumnId: string;
}
