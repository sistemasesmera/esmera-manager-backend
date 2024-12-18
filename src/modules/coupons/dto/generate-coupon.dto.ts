import { IsString, IsEmail, Length, Matches } from 'class-validator';

export class GenerateCouponDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  @Length(1, 50, { message: 'Name must be between 1 and 50 characters' })
  name: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone must be a valid international phone number',
  })
  phone: string;

  @IsString()
  campaignCode: string; // Código de la campaña
}
