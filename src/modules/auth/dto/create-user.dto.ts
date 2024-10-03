import { IsEmail, IsNotEmpty, IsEnum, MinLength } from 'class-validator';
import { UserRoles } from 'src/constants/Roles.enum';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  // No permite el rol ADMIN
  @IsEnum(UserRoles)
  role: UserRoles.ADMIN;
}
