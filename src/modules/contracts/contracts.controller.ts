import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UserData } from 'src/decorators/user.decorator';
import { UserRoles } from 'src/constants/Roles.enum';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { AuthenticatedUser } from 'src/interfaces/authenticated-user.interface';
import { PaginationDto } from './dto/PaginationDto.dto';
import { ReportFiltersDto } from './dto/report-filters.dto';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS, UserRoles.COMMERCIAL)
  create(
    @Body() createContractDto: CreateContractDto,
    @UserData() user: AuthenticatedUser,
  ) {
    return this.contractsService.create(createContractDto, user);
  }

  @Get()
  getContracts(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: PaginationDto,
  ) {
    const { page, limit, q } = query;
    return this.contractsService.getAllContracts(page, limit, q);
  }

  @Get('my-contracts')
  @UseGuards(JwtAuthGuard)
  getMyContracts(
    @UserData() user: AuthenticatedUser,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    paginationDto: PaginationDto,
  ) {
    const { page, limit, ...filters } = paginationDto;
    return this.contractsService.findAllByUserId(user.id, page, limit, filters);
  }

  @Get('reports')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS)
  async getReport(@Query() filters: ReportFiltersDto) {
    try {
      const report = await this.contractsService.getReport(filters);
      return report;
    } catch (error) {
      throw new BadRequestException(error.message); // O puedes personalizar la respuesta
    }
  }
}
