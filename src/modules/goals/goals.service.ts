import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonthlyGoal } from './entities/goals.entity';
import { CreateGoalDto } from './dto/create-goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(MonthlyGoal)
    private readonly goalRepository: Repository<MonthlyGoal>,
  ) {}

  private validateHolidays(monthYear: string, holidays: string[]): void {
    const [year, month] = monthYear.split('-').map(Number);

    holidays.forEach((holiday) => {
      const [holidayYear, holidayMonth, holidayDay] = holiday
        .split('-')
        .map(Number);

      // Verificar que el año y el mes de la fecha del holiday coincidan con el mes y año proporcionado
      if (holidayYear !== year || holidayMonth !== month) {
        throw new BadRequestException(
          `Holiday ${holiday} must be within the same month and year as the ${monthYear}.`,
        );
      }

      // Verificar que el día esté dentro de los límites del mes
      const daysInMonth = new Date(year, month, 0).getDate(); // Obtiene el número de días en el mes
      if (holidayDay < 1 || holidayDay > daysInMonth) {
        throw new BadRequestException(
          `Holiday ${holiday} is invalid, as the day is out of range for the month.`,
        );
      }
    });
  }

  private async checkIfMonthExists(monthYear: string): Promise<void> {
    const existingGoal = await this.goalRepository.findOne({
      where: { month_year: monthYear },
    });
    if (existingGoal) {
      throw new ConflictException(
        `A goal already exists for the month ${monthYear}.`,
      );
    }
  }

  private calculateWorkingDays(monthYear: string, holidays: string[]): number {
    // Validar formato YYYY-MM
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(monthYear)) {
      throw new BadRequestException('Invalid month format. Use YYYY-MM.');
    }

    const [year, month] = monthYear.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate(); // Días totales en el mes

    // Crear un Set con los días no laborables para acceso rápido
    const nonWorkingDays = new Set(holidays);

    // Establecer las fechas límite del mes (desde el 01 al último día del mes)
    const firstDayOfMonth = new Date(year, month - 1, 1); // 00:00:00 del primer día
    const lastDayOfMonth = new Date(year, month, 0); // 23:59:59 del último día del mes
    lastDayOfMonth.setHours(23, 59, 59, 999); // Ajustar para incluir todo el día

    let workingDays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);

      // Asegurarse de que el día esté dentro del rango desde el 01 hasta el último día del mes
      if (currentDate >= firstDayOfMonth && currentDate <= lastDayOfMonth) {
        const formattedDate = currentDate.toLocaleDateString('en-CA'); // Formato YYYY-MM-DD
        const isHoliday = nonWorkingDays.has(formattedDate); // Verificar si es festivo

        // Si no es festivo ni fin de semana, contar como día laborable
        if (!isHoliday) {
          workingDays++;
        }
      }
    }

    return workingDays;
  }

  // Crear una nueva meta mensual
  async createGoal(createGoalDto: CreateGoalDto): Promise<MonthlyGoal> {
    const {
      month_year,
      common_goal,
      contracts_goal,
      holidays = [],
    } = createGoalDto;

    // Validar las fechas de holidays
    this.validateHolidays(month_year, holidays);

    // Verificar si ya existe un registro con el mismo month_year
    await this.checkIfMonthExists(month_year);

    // Calcular los días laborables
    const daysInMonth = this.calculateWorkingDays(month_year, holidays);

    // Crear instancia de la meta
    const goal = this.goalRepository.create({
      month_year,
      common_goal,
      contracts_goal,
      holidays: holidays.length > 0 ? holidays : null, // Guardar como JSON o null
      days_in_month: daysInMonth,
    });

    // Guardar en la base de datos
    return await this.goalRepository.save(goal);
  }
  async getGoal(month_year: string): Promise<MonthlyGoal> {
    // Obtener la meta por el month_year excluyendo created_at y updated_at
    const goal = await this.goalRepository.findOne({
      where: { month_year },
      select: [
        'id',
        'month_year',
        'common_goal',
        'contracts_goal',
        'holidays',
        'days_in_month',
      ],
    });

    if (!goal) {
      throw new BadRequestException(
        `No se encontró ningún objetivo para el mes ${month_year}`,
      );
    }
    return goal;
  }
}
