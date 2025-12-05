import { Controller, Post, Body } from '@nestjs/common';
import {
  CreateOnlineSaleCourseDto,
  OnlineSaleCourseService,
} from './online-sale-course.service';

@Controller('online-sale-course')
export class OnlineSaleCourseController {
  constructor(
    private readonly onlineSaleCourseService: OnlineSaleCourseService,
  ) {}

  /**
   * Simular una venta manualmente (TEST)
   * POST /online-sale-course/test-sale
   */
  @Post('test-sale')
  async simulateSale(@Body() body: Partial<CreateOnlineSaleCourseDto>) {
    // Validación rápida para evitar errores en test
    if (!body.name || !body.lastName || !body.email) {
      return { error: 'name, lastName y email son obligatorios.' };
    }

    const sale = await this.onlineSaleCourseService.create({
      name: body.name,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone ?? '000000000',
      nameCourse: body.nameCourse ?? 'Curso Simulado',
      amount: body.amount ?? 100,
      practiceMode: body.practiceMode ?? 'online',
      modality: body.modality ?? 'sin-modalidad',
      paymentReference: body.paymentReference ?? 'TEST-PAYMENT',
      ref_code: body.ref_code,
    });

    return {
      message: 'Venta simulada creada correctamente',
      sale,
    };
  }
}
