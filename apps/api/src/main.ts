import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { ApiModule } from './api/api.module';

async function bootstrap() {
  const api = await NestFactory.create(ApiModule);
  const configService = api.get(ConfigService);

  api.use(helmet());
  api.use(compression());
  api.enableCors();
  api.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await api.listen(+configService.get<number>('API_PORT', 8080));
}

bootstrap();
