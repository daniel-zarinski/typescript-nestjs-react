import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import type { AnySchema } from 'yup';
import type { ValidateOptions } from 'yup/lib/types';

@Injectable()
export class YupValidationPipe<Schema> implements PipeTransform {
  constructor(private schema: AnySchema<Schema>, private options?: ValidateOptions) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, _metadata: ArgumentMetadata) {
    try {
      const validValue = this.schema.validateSync(value, {
        stripUnknown: true,
        abortEarly: false,
        ...this.options,
      });

      return validValue;
    } catch (err) {
      throw new BadRequestException({
        error: 'Validation Error',
        statusCode: 400,
        message: err.message,
        data: err.errors,
      });
    }
  }
}
