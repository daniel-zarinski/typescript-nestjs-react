import { Injectable } from '@nestjs/common';
import { prop } from '@lib/shared';

@Injectable()
export class ApiService {
  getHello(): string {
    console.log({ prop });
    return 'Hello World!';
  }
}
