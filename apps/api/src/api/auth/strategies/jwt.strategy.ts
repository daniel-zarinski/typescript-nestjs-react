import { User } from '@lib/database';
import { JWT } from '@lib/shared';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(configService: ConfigService, private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('AUTH_SECRET'),
    });
  }

  async validate(payload: JWT): Promise<User> {
    this.logger.log('JWT: Validating payload:', { payload });

    // TODO: Add exp check?

    const user = await this.usersService.findById(payload.id);

    this.logger.log(`JWT: Found user with id: ${user.id}`);

    return user;
  }
}
