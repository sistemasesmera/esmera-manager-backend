// src/alumn/alumn.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAlumnDto } from './dto/create-alumn.dto';
import { Alumn } from './entities/alumn.entity';
import { FilterAlumnDto } from './dto/filter-alumn.dto';
import { UpdateAlumnDto } from './dto/update-alumn.dto';

@Injectable()
export class AlumnService {
  constructor(
    @InjectRepository(Alumn)
    private readonly alumnRepository: Repository<Alumn>,
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
    const newAlumn = this.alumnRepository.create(createAlumnDto);
    return await this.alumnRepository.save(newAlumn);
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
    const { name, email, documentType, documentNumber, page, limit } =
      filterAlumnDto;

    const queryBuilder = this.alumnRepository.createQueryBuilder('alumn');

    // Application search query parameters
    if (name) {
      queryBuilder.andWhere('alumn.firstName ILIKE :name', {
        name: `%${name}%`,
      });
    }
    if (email) {
      queryBuilder.andWhere('alumn.email ILIKE :email', {
        email: `%${email}%`,
      });
    }
    if (documentType) {
      queryBuilder.andWhere('alumn.documentType = :documentType', {
        documentType,
      });
    }
    if (documentNumber) {
      queryBuilder.andWhere('alumn.documentNumber ILIKE :documentNumber', {
        documentNumber: `%${documentNumber}%`,
      });
    }

    // Agregar ordenamiento por fecha de creación (createdAt) en orden descendente
    queryBuilder.orderBy('alumn.createdAt', 'DESC');

    // Paginate results
    const [result, total] = await queryBuilder
      .skip((page - 1) * limit) // Salto de registros
      .take(limit) // Número de registros a tomar
      .getManyAndCount(); // Obtén los resultados y el total

    return {
      count: total, // Total de registros encontrados
      page, // Página actual
      limit, // Límite por página
      data: result, // Datos de la página actual
      totalPages: Math.ceil(total / limit), // Total de páginas calculadas a partir del total de registros
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
    };

    await this.alumnRepository.save(updatedAlumn);

    return updatedAlumn; // Retornar el alumno actualizado
  }
}
