import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { UsersModule } from '../users/users.module';
import { ContractsModule } from '../contracts/contracts.module';

@Module({
  imports: [UsersModule, ContractsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
