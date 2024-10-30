import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

// load .[current environment].env file
ConfigModule.forRoot({
  envFilePath: `.env`,
});

// getting config service instance with current environment values
const configService = new ConfigService();

const ConfigDB = {
  type: configService.get('DB_CONNECTION'),
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: String(configService.get('DB_PASSWORD')),
  database: configService.get('DB_NAME'),
  synchronize: false,
  dropSchema: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
  factories: [__dirname + '/factories/**/*{.ts,.js}'],
  cli: {
    migrationsDir: __dirname + '/migrations/',
  },
  migrationsTableName: 'migrations',
  ssl: {
   UnauthorizedException: true,
  },
};

const dataSourceConfig: DataSourceOptions = ConfigDB;

export const DataSourceConfig: DataSourceOptions = dataSourceConfig;

export const AppDS = new DataSource(DataSourceConfig);
