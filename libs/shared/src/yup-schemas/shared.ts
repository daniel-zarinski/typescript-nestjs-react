import * as yup from 'yup';

export const idSchema = yup.number().min(1).required();
