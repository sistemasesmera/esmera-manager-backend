import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRoles } from 'src/constants/Roles.enum';
import { PaginationDto } from './dto/PaginationDto.dto';
import { User } from './entities/user.entity';
import { UpdateCommercialStatusDto } from './dto/update-commercial-status.dto';
import { CreateCommercialDto } from './dto/create-commercial.dto.';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('commercials')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS)
  async createCommercial(
    @Body(new ValidationPipe()) createCommercialDto: CreateCommercialDto,
  ): Promise<User> {
    return this.usersService.createCommercial(createCommercialDto);
  }

  @Get('commercials')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS)
  getCommercials(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    paginationDto: PaginationDto,
  ) {
    const { page, limit, email, active } = paginationDto;
    return this.usersService.getCommercials(page, limit, email, active);
  }

  @Put('/commercials/:id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS)
  async activateCommercial(
    @Param('id') id: string,
    @Body() updateCommercialStatusDto: UpdateCommercialStatusDto,
  ): Promise<User> {
    return this.usersService.updateCommercialStatus(
      id,
      updateCommercialStatusDto.active,
    );
  }

  //TODO: Falta que el ComercialPlus y Admin puedan editar un comercial
  //TODO: Falta que el ComercialPlus y Admin puedan cambiarle la contraseña a un comercial
}
