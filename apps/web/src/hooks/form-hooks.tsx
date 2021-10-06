import { yupResolver } from '@hookform/resolvers/yup';
import { YupValues } from '@lib/schema';
import { Control, useForm, UseFormProps, UseFormReturn } from 'react-hook-form';
import { AnyObjectSchema } from 'yup';

export interface UseHookFormProps<
  Schema extends AnyObjectSchema,
  TFieldValues extends YupValues<Schema>,
> extends UseFormProps<TFieldValues> {
  schema: Schema;
}

export const useHookForm = <
  Schema extends AnyObjectSchema,
  TFieldValues extends YupValues<Schema>,
>({
  schema,
  ...props
}: UseHookFormProps<Schema, TFieldValues>): [
  // eslint-disable-next-line @typescript-eslint/ban-types
  UseFormReturn<TFieldValues, object>,
  { schema: Schema; control: Control<TFieldValues> },
] => {
  const useFormReturn = useForm<TFieldValues>({
    resolver: yupResolver(schema),
    defaultValues: schema ? schema.getDefault() : props.defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    ...props,
  });
  return [useFormReturn, { schema, control: useFormReturn.control }];
  // return { ...useFormReturn, useFormReturn: { schema, control: useFormReturn.control } }; // MARK: or this
};
