import { emailAuthSchema } from '@lib/shared';
import { Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(
    @Req()
    req,
  ) {
    this.logger.log(req);
    const auth = emailAuthSchema.validateSync(req.user, { stripUnknown: true });

    return this.authService.login(auth);
  }
}
