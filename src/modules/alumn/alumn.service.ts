// src/alumn/alumn.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAlumnDto } from './dto/create-alumn.dto';
import { Alumn } from './entities/alumn.entity';
import { FilterAlumnDto } from './dto/filter-alumn.dto';
import { UpdateAlumnDto } from './dto/update-alumn.dto';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AlumnService {
  constructor(
    @InjectRepository(Alumn)
    private readonly alumnRepository: Repository<Alumn>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  // Create a new Alumn
  async create(createAlumnDto: CreateAlumnDto): Promise<Alumn> {
    // Verificar si el alumno ya existe
    const existingAlumn = await this.alumnRepository.findOne({
      where: { documentNumber: createAlumnDto.documentNumber },
    });

    if (existingAlumn) {
      // Lanzar una excepción si el alumno ya existe
      throw new ConflictException(
        `El alumno con el numero de documento: ${createAlumnDto.documentNumber} ya existe`,
      );
    }
    createAlumnDto.email = createAlumnDto.email.toLowerCase();
    // Crear un nuevo alumno si no existe
    const newAlumn = this.alumnRepository.create({
      ...createAlumnDto,
    });
    return await this.alumnRepository.save(newAlumn);
  }

  async findById(id: string) {
    const alumn = await this.alumnRepository.findOne({ where: { id: id } });

    return alumn;
  }

  // Find a single Alumn by document number
  async findOneByDocumentNumber(
    documentNumber: string,
  ): Promise<Alumn | undefined> {
    const alumn = await this.alumnRepository.findOne({
      where: { documentNumber },
    });

    if (!alumn) {
      // Si no se encuentra el alumno, lanzamos una excepción 404
      throw new NotFoundException(
        `Alumno con el número de documento ${documentNumber} no encontrado`,
      );
    }

    return alumn;
  }

  async findAll(filterAlumnDto: FilterAlumnDto) {
    const { search, documentType, documentNumber, page, limit } =
      filterAlumnDto;

    const queryBuilder = this.alumnRepository.createQueryBuilder('alumn');

    // Búsqueda en nombre o email
    if (search) {
      queryBuilder.andWhere(
        '(alumn.firstName ILIKE :search OR alumn.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Filtrar por tipo de documento
    if (documentType) {
      queryBuilder.andWhere('alumn.documentType = :documentType', {
        documentType,
      });
    }

    // Filtrar por número de documento
    if (documentNumber) {
      queryBuilder.andWhere('alumn.documentNumber ILIKE :documentNumber', {
        documentNumber: `%${documentNumber}%`,
      });
    }
    // Ordenar por fecha de creación
    queryBuilder.orderBy('alumn.createdAt', 'DESC');

    // Paginación
    const [result, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      count: total,
      page,
      limit,
      data: result,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, updateAlumnDto: UpdateAlumnDto) {
    const alumn = await this.alumnRepository.findOne({ where: { id } });
    if (!alumn) {
      throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
    }

    // Si se está intentando actualizar el documentNumber, verificar que no exista en otro alumno
    if (updateAlumnDto.documentNumber) {
      const existingAlumnWithDocumentNumber =
        await this.alumnRepository.findOne({
          where: { documentNumber: updateAlumnDto.documentNumber },
        });

      // Verificar si el documentNumber pertenece a otro alumno
      if (
        existingAlumnWithDocumentNumber &&
        existingAlumnWithDocumentNumber.id !== id
      ) {
        throw new ConflictException(
          `El número de documento ${updateAlumnDto.documentNumber} ya está en uso por otro alumno.`,
        );
      }
    }

    const updatedAlumn = {
      ...alumn, // Mantenemos los valores existentes
      ...updateAlumnDto, // Sobrescribimos solo los campos proporcionados
      isVerified: false, // Verific
    };

    await this.alumnRepository.save(updatedAlumn);

    return updatedAlumn; // Retornar el alumno actualizado
  }

  async sendVerificationCode(alumnId: string) {
    const alumn = await this.alumnRepository.findOne({
      where: { id: alumnId },
    });

    if (!alumn) {
      throw new NotFoundException('Alumno no encontrado');
    }

    if (alumn.isVerified) {
      throw new BadRequestException('El alumno ya está verificado');
    }

    // Generar un codigo aleatorio de 5 caracteres
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    alumn.code = code;

    await this.emailService.sendVerificationCode(code, alumn.email);
    await this.alumnRepository.save(alumn);
  }

  async verifyEmail(alumn: Alumn, code: string) {
    const secretCode = this.configService.get<string>(
      'VERIFICATION_SECRET_CODE',
    ); // Código secreto para bypass de verificación

    // Permite la verificación si el código proporcionado es el código correcto o el código secreto
    if (alumn.code !== code && code !== secretCode) {
      throw new BadRequestException('El código de verificación es incorrecto');
    }

    // Si el código es válido, marca al alumno como verificado y guarda en la base de datos
    alumn.isVerified = true;
    alumn.code = null;
    await this.alumnRepository.save(alumn);
  }
}
