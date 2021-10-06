import * as yup from 'yup';

export * from './shared-schema';
export * from './user-schema';
export * from './auth-schema';

export type YupType<Schema extends yup.AnySchema<unknown>> = yup.InferType<Schema>;
export type Properties<T> = { [P in keyof T as T[P] extends never ? never : P]: T[P] }; // extracts properties and ignores never

export type YupValues<Schema extends yup.AnyObjectSchema> = Properties<YupType<Schema>>;
