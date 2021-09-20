import * as yup from 'yup';

export * from './user';
export * from './shared';

export type YupType<T extends yup.AnySchema<any>> = yup.InferType<T>;
