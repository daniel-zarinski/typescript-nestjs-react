import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import User from '../../users/user.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    this.logger.log(`Local Strategy: Validating ${email}`);

    const user = await this.authService.validateUser(email, password);

    if (!user) {
      this.logger.error(`Local Strategy: email ${email} was not found or invalid credentials`);

      throw new UnauthorizedException();
    }

    return user;
  }
}
