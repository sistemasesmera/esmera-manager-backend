import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { AlumnService } from './alumn.service';
import { CreateAlumnDto } from './dto/create-alumn.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRoles } from 'src/constants/Roles.enum';
import { Roles } from '../auth/roles.decorator';
import { FilterAlumnDto } from './dto/filter-alumn.dto';
import { UpdateAlumnDto } from './dto/update-alumn.dto';

@Controller('alumns')
export class AlumnController {
  constructor(private readonly alumnService: AlumnService) {}

  // Create a new  Alumn
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS, UserRoles.COMMERCIAL)
  create(@Body() createAlumnDto: CreateAlumnDto) {
    return this.alumnService.create(createAlumnDto);
  }

  // Find a Alumn by document number(DNI, NIE, PASSPORT)
  @Get('/:documentNumber')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS, UserRoles.COMMERCIAL)
  findOne(@Param('documentNumber') documentNumber: string) {
    return this.alumnService.findOneByDocumentNumber(documentNumber);
  }

  // Get Alumns with filters
  @Get()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS, UserRoles.COMMERCIAL)
  findAll(@Query() filterAlumnDto: FilterAlumnDto) {
    return this.alumnService.findAll(filterAlumnDto);
  }

  // PUT /alumns/:id -> Para actualizar un alumno
  @Put(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS, UserRoles.COMMERCIAL)
  async updateAlumn(
    @Param('id') id: string,
    @Body() updateAlumnDto: UpdateAlumnDto,
  ) {
    return this.alumnService.update(id, updateAlumnDto);
  }
}
