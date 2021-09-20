import { ApiController } from './api.controller';
import { ObjectionModule } from '@willsoto/nestjs-objection';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { HttpLoggerMiddleware } from './middleware/http.logger';
import { AuthController } from './auth/auth.controller';
import { ApiService } from './api.service';
import { Knex } from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import BaseModel from '@lib/shared/models/base-model';
import User from './users/user.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ObjectionModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          Model: BaseModel,
          config: {
            client: 'mysql2',
            debug: true,
            version: '8',
            connection: {
              host: config.get('DB_HOST'),
              user: config.get('DB_USERNAME'),
              password: config.get('DB_PASSWORD'),
              database: config.get('DB_DATABASE'),
              port: config.get('DB_PORT'),
            },
            migrations: {},

            ...knexSnakeCaseMappers(),
          } as Knex.Config,
        };
      },
    }),
    ObjectionModule.forFeature([User]),
    UsersModule,
    AuthModule,
  ],
  exports: [ObjectionModule],
  controllers: [ApiController, UsersController, AuthController],
  providers: [ApiService],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
