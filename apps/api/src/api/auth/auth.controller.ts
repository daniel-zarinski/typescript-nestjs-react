import { Controller, Logger, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Req()
    req,
  ) {
    console.log({ user: req.user });
    if (!req.user) throw new UnauthorizedException();

    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/refresh')
  async refresh(
    @Req()
    req,
  ) {
    console.log({ user: req.user });
    if (!req.user) throw new UnauthorizedException();

    return this.authService.login(req.user);
  }
}
