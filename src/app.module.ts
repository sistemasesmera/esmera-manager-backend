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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', // Archivo de configuración
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
