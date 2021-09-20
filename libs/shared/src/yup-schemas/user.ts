import * as yup from 'yup';
import type { YupType } from '.';
import { Role } from '../types/auth';

export const userSchema = yup.object().shape({
  email: yup.string().email().min(5).max(255).required(),
  firstName: yup.string().min(1).max(255).required().default(''),
  lastName: yup.string().min(1).max(255).required().default(''),
  password: yup.string().min(6).max(999).required().default(''),
});

export type IUserSchema = YupType<typeof userSchema>;

export const userModelSchema = userSchema.shape({
  isActive: yup.boolean().required().default(true),
  roles: yup
    .array()
    .of(yup.string().oneOf(Object.values(Role)))
    .required()
    .default([Role.User]),
});

export type IUserModel = YupType<typeof userModelSchema>;
