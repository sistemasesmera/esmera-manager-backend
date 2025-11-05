import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import { AuthenticatedUser } from 'src/interfaces/authenticated-user.interface';
import { UserData } from 'src/decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateCommercialPasswordDto } from './dto/update-commercial.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Endpoint para crear un Comercial nuevo (sea comercial o plus)
  @Post('commercials')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS)
  async createCommercial(
    @Body(new ValidationPipe()) createCommercialDto: CreateCommercialDto,
  ): Promise<User> {
    return this.usersService.createCommercial(createCommercialDto);
  }

  //Endpoint para traer los comerciales
  @Get('commercials')
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS)
  getCommercials(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    paginationDto: PaginationDto,
  ) {
    const { page, limit, active, searchTerm } = paginationDto;
    return this.usersService.getCommercials(page, limit, active, searchTerm);
  }

  @Get('commercials-select')
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS)
  getCommercialsSelect() {
    return this.usersService.getCommercialsSelect();
  }
  //Endpoint para editar los comerciales
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS)
  @Patch('commercials/:id')
  async patchUser(
    @Param('id') id: string,
    @Body() partialUpdateDto: Partial<UpdateUserDto>,
  ) {
    return this.usersService.updatePartial(id, partialUpdateDto);
  }

  //Endpoint para activar/desactivar un comercial (solo podra hacerlo comercial y admin)
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

  //Endpoint para cambiar la contraseña de los comerciales (solo lo podra hacer un usuario admin y un comercial plus)

  @Patch('commercials/:id/password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS)
  async changeCommercialPassword(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updatePasswordDto: UpdateCommercialPasswordDto,
  ) {
    const { newPassword } = updatePasswordDto;
    return this.usersService.changeCommercialPassword(id, newPassword);
  }

  //Endpoint para que puedan editar sus datos.
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS, UserRoles.COMMERCIAL)
  async updateMe(
    @Body(new ValidationPipe()) updateUserDto: Partial<UpdateUserDto>,
    @UserData() user: AuthenticatedUser,
  ): Promise<User> {
    // Aquí en el servicio se asegura de que solo se actualicen los campos permitidos
    return this.usersService.updateOwnData(user.id, updateUserDto);
  }
}
