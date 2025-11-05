// src/online-sale-course/online-sale-course.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnlineSaleCourse } from './entities/online-sale-course.entity';
import { User } from '../users/entities/user.entity';

export interface CreateOnlineSaleCourseDto {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  nameCourse: string;
  amount: number;
  practiceMode: string;
  modality: string;
  paymentReference?: string;
  ref_code: string;
}

@Injectable()
export class OnlineSaleCourseService {
  constructor(
    @InjectRepository(OnlineSaleCourse)
    private readonly onlineSaleRepo: Repository<OnlineSaleCourse>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Crear un registro de venta online de curso
   */
  async create(dto: CreateOnlineSaleCourseDto): Promise<OnlineSaleCourse> {
    // Buscar usuario (comercial) por ref_code
    const user = await this.userRepo.findOne({
      where: { username: dto.ref_code },
    });

    // Crear la venta
    const sale = this.onlineSaleRepo.create({
      ...dto,
      commercial: user || null, // asociar si existe
    });

    // Guardar la venta
    return this.onlineSaleRepo.save(sale);
  }

  /**
   * Listar todas las ventas online (opcional)
   */
  async findAll(): Promise<OnlineSaleCourse[]> {
    return this.onlineSaleRepo.find({
      order: { createdAt: 'DESC' },
    });
  }
}
