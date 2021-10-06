import { User } from '@lib/database';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ObjectionModule } from '@willsoto/nestjs-objection';
import { Knex } from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { HttpLoggerMiddleware } from './middleware/http.logger';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';

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
          config: {
            client: 'pg',
            debug: true,
            version: '13',
            connection: {
              connectionString: config.get('DB_CONNECTION_STRING'),
              ssl: config.get<boolean>('DEV', false)
                ? false
                : {
                    rejectUnauthorized: false,
                  },
            },
            migrations: {
              directory: './libs/migrations/src',
            },

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
