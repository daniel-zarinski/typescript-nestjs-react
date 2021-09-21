import * as yup from 'yup';

export * from './shared';
export * from './user';
export * from './auth';

export type YupType<Schema extends yup.AnySchema<any>> = yup.InferType<Schema>;
export type Properties<T> = { [P in keyof T as T[P] extends never ? never : P]: T[P] }; // extracts properties and ignores never
