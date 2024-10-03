import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { User } from 'src/decorators/user.decorator';
import { UserRoles } from 'src/constants/Roles.enum';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { AuthenticatedUser } from 'src/interfaces/authenticated-user.interface';
import { PaginationDto } from './dto/PaginationDto.dto';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS, UserRoles.COMMERCIAL)
  create(
    @Body() createContractDto: CreateContractDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.contractsService.create(createContractDto, user);
  }

  @Get('my-contracts')
  @UseGuards(JwtAuthGuard)
  getMyContracts(
    @User() user: AuthenticatedUser,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    paginationDto: PaginationDto,
  ) {
    const { page, limit, ...filters } = paginationDto;
    return this.contractsService.findAllByUserId(user.id, page, limit, filters);
  }
}
