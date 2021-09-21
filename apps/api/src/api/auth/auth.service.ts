import { IEmailAuth } from '@lib/shared';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import User from '../users/user.model';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    this.logger.debug('Auth Service: Validating User.');

    const user = await this.usersService.findByEmail(email);

    if (user && (await this.usersService.verifyPassword(pass, user.password))) {
      return user;
    }

    return null;
  }

  async login({ email, id }: IEmailAuth) {
    this.logger.debug('Auth Service: Login', { email, id });

    return {
      access_token: this.jwtService.sign({
        id,
        email,
      }),
    };
  }
}
