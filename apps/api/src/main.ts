import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { ApiModule } from './api/api.module';

async function bootstrap() {
  const api = await NestFactory.create(ApiModule);
  const configService = api.get(ConfigService);

  // Nest
  api.setGlobalPrefix(configService.get<string>('API_VERSION', 'v1'));
  api.use(helmet());
  api.use(compression());
  api.enableCors();

  await api.listen(+configService.get<number>('API_PORT', 8080));
}

bootstrap();
