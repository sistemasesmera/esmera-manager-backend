import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlumnModule } from './modules/alumn/alumn.module';
import { DataSourceConfig } from './config/data-source.config';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
