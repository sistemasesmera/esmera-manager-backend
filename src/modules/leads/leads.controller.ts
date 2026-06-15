import {
  Controller,
  Body,
  Post,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { CreateLeadOnlineDto } from './dto/create-lead-online';
import { CreateLeadManualDto } from './dto/create-lead-manual.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { AssignLeadDto } from './dto/assign-lead.dto';
import { ChangeLeadStatusDto } from './dto/change-status.dto';
import { FilterLeadDto } from './dto/filter-lead.dto';
import { StatsLeadDto } from './dto/stats-lead.dto';
import { ConvertLeadDto } from './dto/convert-lead.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRoles } from 'src/constants/Roles.enum';
import { UserData } from 'src/decorators/user.decorator';
import { AuthenticatedUser } from 'src/interfaces/authenticated-user.interface';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  //Para cursos presenciales - (lleva a tablero principal). Endpoint público usado por la web.
  @Post()
  async create(@Body() createLeadDto: CreateLeadDto) {
    return await this.leadsService.create(createLeadDto);
  }

  //Para cursos online - (lleva a tablero de cursos online). Endpoint público usado por la web.
  @Post('online')
  async createLead(@Body() createLeadDto: CreateLeadOnlineDto) {
    return await this.leadsService.createOnline(createLeadDto);
  }

  @Post('manual')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS, UserRoles.COMMERCIAL)
  createManual(
    @Body() dto: CreateLeadManualDto,
    @UserData() user: AuthenticatedUser,
  ) {
    return this.leadsService.createManual(dto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS, UserRoles.COMMERCIAL)
  findAll(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    filter: FilterLeadDto,
    @UserData() user: AuthenticatedUser,
  ) {
    return this.leadsService.findAll(filter, user);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS, UserRoles.COMMERCIAL)
  getStats(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    filter: StatsLeadDto,
    @UserData() user: AuthenticatedUser,
  ) {
    return this.leadsService.getStats(filter, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS, UserRoles.COMMERCIAL)
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS, UserRoles.COMMERCIAL)
  update(@Param('id') id: string, @Body() dto: UpdateLeadDto) {
    return this.leadsService.update(id, dto);
  }

  @Patch(':id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS)
  assign(@Param('id') id: string, @Body() dto: AssignLeadDto) {
    return this.leadsService.assign(id, dto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS, UserRoles.COMMERCIAL)
  changeStatus(@Param('id') id: string, @Body() dto: ChangeLeadStatusDto) {
    return this.leadsService.changeStatus(id, dto);
  }

  @Post(':id/convert')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS, UserRoles.COMMERCIAL)
  convert(@Param('id') id: string, @Body() dto: ConvertLeadDto) {
    return this.leadsService.convert(id, dto);
  }
}
