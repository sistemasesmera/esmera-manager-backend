import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { UsersModule } from '../users/users.module';
import { ContractsModule } from '../contracts/contracts.module';
import { GoalsModule } from '../goals/goals.module';
import { OnlineSaleCourseModule } from '../online-sale-course/online-sale-course.module';

@Module({
  imports: [UsersModule, ContractsModule, GoalsModule, OnlineSaleCourseModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
