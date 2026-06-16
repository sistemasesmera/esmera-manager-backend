import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { UsersModule } from '../users/users.module';
import { ContractsModule } from '../contracts/contracts.module';
import { GoalsModule } from '../goals/goals.module';
import { OnlineSaleCourseModule } from '../online-sale-course/online-sale-course.module';
import { Lead } from '../leads/entities/lead.entity';
import { Alumn } from '../alumn/entities/alumn.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, Alumn]),
    UsersModule,
    ContractsModule,
    GoalsModule,
    OnlineSaleCourseModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
