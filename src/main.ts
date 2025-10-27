import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import rawBodyMiddleware from './middleware/raw-body.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para todos los orígenes
  app.enableCors({
    origin: '*', // Permite todos los orígenes
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(rawBodyMiddleware());

  // Usar json
  app.use(bodyParser.json());

  //Configurar morgan para registrar las peticiones http
  app.use(morgan('dev')); // Puedes usar 'dev', 'combined', o configurar un formato personalizado

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
