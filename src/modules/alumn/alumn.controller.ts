import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Query,
  Put,
  NotFoundException,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { AlumnService } from './alumn.service';
import { CreateAlumnDto } from './dto/create-alumn.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRoles } from 'src/constants/Roles.enum';
import { Roles } from '../auth/roles.decorator';
import { FilterAlumnDto } from './dto/filter-alumn.dto';
import { UpdateAlumnDto } from './dto/update-alumn.dto';
import { SendVerificationCodeDto } from './dto/send-verification-code.dto';
import { VerifyCode } from './dto/verify-code.dto';

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

  // PATCH /alumns/:id -> Para actualizar un alumno de forma partial
  @Patch(':id')
  async patchAlumn(
    @Param('id') id: string,
    @Body() partialUpdateDto: Partial<UpdateAlumnDto>,
  ) {
    return this.alumnService.updatePartial(id, partialUpdateDto);
  }

  // Endpoint para enviar el codigo al email del alumno.
  @Post('send-verification-code')
  async sendVerificationCode(
    @Body() sendVerificationCodeDto: SendVerificationCodeDto,
  ) {
    await this.alumnService.sendVerificationCode(
      sendVerificationCodeDto.alumnId,
    );

    return {
      message: 'El código de verificación ha sido enviado al email del alumno',
    };
  }

  // Endpoint para activar el alumno mediante el codigo.
  @Post('verify-code')
  async verifyCode(@Body() verifyCode: VerifyCode) {
    const alumn = await this.alumnService.findById(verifyCode.alumnId);

    if (!alumn) {
      throw new NotFoundException('Alumno no encontrado');
    }
    if (alumn.isVerified) {
      throw new BadRequestException('El alumno ya ha sido verificado');
    }

    if (!alumn.code) {
      throw new BadRequestException('No se ha generado código de verificación');
    }

    await this.alumnService.verifyEmail(alumn, verifyCode.code);

    return {
      message: 'El código de verificación ha sido verificado correctamente',
    };
  }
}
