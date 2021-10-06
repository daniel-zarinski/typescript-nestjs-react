import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiService {
  constructor(private readonly configService: ConfigService) {}

  getVersion(): string {
    return this.configService.get<string>('API_VERSION', 'v0');
  }
}
