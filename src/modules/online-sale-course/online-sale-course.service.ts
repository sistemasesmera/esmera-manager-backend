// src/online-sale-course/online-sale-course.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnlineSaleCourse } from './entities/online-sale-course.entity';

export interface CreateOnlineSaleCourseDto {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  nameCourse: string;
  amount: number;
  practiceMode: string; // nuevo campo
  modality: string; // nuevo campo
  paymentReference?: string;
}

@Injectable()
export class OnlineSaleCourseService {
  constructor(
    @InjectRepository(OnlineSaleCourse)
    private readonly onlineSaleRepo: Repository<OnlineSaleCourse>,
  ) {}

  /**
   * Crear un registro de venta online de curso
   */
  async create(dto: CreateOnlineSaleCourseDto): Promise<OnlineSaleCourse> {
    const sale = this.onlineSaleRepo.create({
      ...dto,
    });

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
