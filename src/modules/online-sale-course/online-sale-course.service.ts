// src/online-sale-course/online-sale-course.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
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

  async getOnlineSalesForCurrentMonth(): Promise<OnlineSaleCourse[]> {
    const today = new Date();
    const currentMonth = today.getMonth(); // Mes actual (0-11)
    const currentYear = today.getFullYear(); // Año actual

    // Calcular el rango del mes actual
    const startOfMonth = new Date(currentYear, currentMonth, 1, 0, 0, 0); // Primer segundo del mes
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59); // Último segundo del mes

    // Obtener ventas online del mes actual
    const sales = await this.onlineSaleRepo.find({
      where: {
        createdAt: Between(startOfMonth, endOfMonth),
      },
      select: {
        id: true, // ID de la venta
        name: true,
        lastName: true,
        practiceMode: true,
        nameCourse: true,
        amount: true, // Monto pagado del curso online
        createdAt: true, // Fecha de creación de la venta
        ref_code: true,
        commercial: {
          id: true, // ID del comercial (o null)
          firstName: true, // Si tiene comercial
          lastName: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return sales;
  }
}
