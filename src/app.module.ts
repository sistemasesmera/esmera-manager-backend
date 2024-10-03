import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDataSourceConfig } from './config/data-source.config';
import { AlumnModule } from './modules/alumn/alumn.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', // Archivo de configuración
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
        getDataSourceConfig(configService),
      inject: [ConfigService],
    }),
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
