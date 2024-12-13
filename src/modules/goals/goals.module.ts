import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { MonthlyGoal } from './entities/goals.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyGoal])],
  controllers: [GoalsController],
  providers: [GoalsService],
  exports: [GoalsService], // Asegúrate de exportar el servicio
})
export class GoalsModule {}
