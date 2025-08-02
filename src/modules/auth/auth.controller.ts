import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { UserRoles } from 'src/constants/Roles.enum';
import { Roles } from './roles.decorator';
import { AuthenticatedUser } from 'src/interfaces/authenticated-user.interface';
import { UserData } from 'src/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // AUTH PENDIENTE. (SOLO PODRAN USAR ESTE ENDPOINT LOS ADMIN Y COMERCIAL-PLUS)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    const result = await this.authService.login(loginDto);
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return result;
  }
  @Post('test')
  async test(@Body() loginDto: any) {
    const result = await this.authService.testChangePassword(
      loginDto.id,
      'celia2025Esmera',
    );
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return result;
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS, UserRoles.COMMERCIAL)
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @UserData() user: AuthenticatedUser,
  ) {
    return this.authService.changePassword(user, changePasswordDto);
  }
}
