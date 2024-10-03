import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export function getDataSourceConfig(
  configService: ConfigService,
): DataSourceOptions {
  return {
    type: 'postgres',
    host: configService.get('DB_HOST') || 'db',
    port: parseInt(configService.get('DB_PORT'), 10) || 5432,
    username: configService.get('DB_USERNAME') || 'user',
    password: configService.get('DB_PASSWORD') || 'secret',
    database: configService.get('DB_NAME') || 'db-public',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Apunta a tus entidades
    synchronize: true, // ¡Cuidado con esto en producción!
    logging: false,
  };
}
