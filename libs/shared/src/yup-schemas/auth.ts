import * as yup from 'yup';
import type { Properties, YupType } from '.';

export const passwordSchema = yup.string().min(6).max(999).required();
export const emailSchema = yup.string().min(3).email().max(255).lowercase().required();

export const emailAuthSchema = yup.object().shape({
  email: emailSchema,
  password: passwordSchema,
});

export type IEmailAuth = YupType<typeof emailAuthSchema>;
export type IEmailAuthProperties = Properties<IEmailAuth>;
