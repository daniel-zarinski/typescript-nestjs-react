import * as yup from 'yup';
import type { YupValues } from '.';

export const passwordSchema = yup.string().min(6).max(999).required().default('');
export const emailSchema = yup.string().min(3).email().max(255).lowercase().required().default('');
export const tokenSchema = yup.object().shape({
  token: yup.string().min(100).required(),
});

export const emailAuthSchema = yup.object().shape({
  email: emailSchema,
  password: passwordSchema,
});

export type IEmailAuthValues = YupValues<typeof emailAuthSchema>;
