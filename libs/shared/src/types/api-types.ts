import { HttpStatus } from '@nestjs/common';
import { JSONSerializable } from 'apps/web/src/stores/api';
import { AxiosError } from 'axios';

export interface ApiError {
  error: string;
  message: string;
  statusCode: HttpStatus;
  data?: JSONSerializable;
  axiosError: AxiosError<ApiError>;
}
