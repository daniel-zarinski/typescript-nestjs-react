import { Role } from '@lib/shared';
import * as yup from 'yup';
import { YupValues } from '.';

export const roleSchema = yup.string().oneOf(Object.values(Role)).required();
export const rolesSchema = yup.array().of(roleSchema).required().default([Role.User]);

export const optionalDateSchema = yup.date().nullable().notRequired();

export const userSchema = yup.object().shape({
  email: yup.string().email().min(5).max(255).required(),
  firstName: yup.string().min(1).max(255).required().default(''),
  lastName: yup.string().min(1).max(255).required().default(''),
  password: yup.string().min(6).max(255).required().default(''),
});

export type IUserValues = YupValues<typeof userSchema>;

export const userModelSchema = userSchema.shape({
  roles: rolesSchema,
});

export type IUserModelValues = YupValues<typeof userModelSchema>;
