import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlumnModule } from './modules/alumn/alumn.module';
import { DataSourceConfig } from './config/data-source.config';
import { EmailModule } from './modules/email/email.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { GoalsModule } from './modules/goals/goals.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { LeadsModule } from './modules/leads/leads.module';
import { BranchModule } from './modules/branch/branch.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({ ...DataSourceConfig }),

    UsersModule,
    AuthModule,
    CoursesModule,
    ContractsModule,
    AlumnModule,
    EmailModule,
    DashboardModule,
    GoalsModule,
    CouponsModule,
    WebhookModule,
    LeadsModule,
    BranchModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
