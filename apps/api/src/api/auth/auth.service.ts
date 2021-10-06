import { IUser, User } from '@lib/database';
import { emailAuthSchema } from '@lib/schema';
import { Nullable } from '@lib/shared';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<Nullable<User>> {
    this.logger.debug(`Auth Service: Validating email: ${email}.`);

    const { email: validEmail, password: validPassword } = await emailAuthSchema.validate({
      email,
      password: pass,
    });

    const user = await this.usersService.findByEmail(validEmail);

    if (!user) {
      this.logger.debug(`Email ${validEmail} was not found.`);

      return null;
    }

    if (await this.usersService.verifyPassword(validPassword, user.password)) {
      return user;
    }

    return null;
  }

  async login({ email, id, roles }: IUser) {
    this.logger.debug('Auth Service: Login', { email, id });

    return {
      token: this.jwtService.sign({
        id: id,
        roles: roles,
      }),
    };
  }
}
