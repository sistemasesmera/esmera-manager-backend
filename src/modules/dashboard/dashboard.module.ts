import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { UsersModule } from '../users/users.module';
import { ContractsModule } from '../contracts/contracts.module';
import { GoalsModule } from '../goals/goals.module';

@Module({
  imports: [UsersModule, ContractsModule, GoalsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
