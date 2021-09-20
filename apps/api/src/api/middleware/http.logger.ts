import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path, params } = request;
    const userAgent = request.get('user-agent') || '';
    const { statusCode } = response;

    response.on('close', () => {
      const contentLength = response.get('content-length');

      this.logger.log(`${method} ${path}${Object.values(params)} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
    });

    response.on('error', (err) => {
      this.logger.error(`${method} ${path}${Object.values(params)} ${statusCode} - ${userAgent} ${ip}`, err);
    });

    next();
  }
}
