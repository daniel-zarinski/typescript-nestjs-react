/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControl as ChakraFormControl,
  FormControlProps as ChakraFormControlProps,
  FormErrorMessage,
  FormLabel,
  Input,
  InputProps,
} from '@chakra-ui/react';
import { YupValues } from '@lib/schema';
import { get, upperFirst } from 'lodash';
import React, { HTMLInputTypeAttribute, useMemo } from 'react';
import { Control, FieldPath, useController } from 'react-hook-form';
import * as yup from 'yup';
import { SchemaDescription } from 'yup/lib/schema';

export interface FormControlProps<
  Schema extends yup.AnyObjectSchema,
  TFieldValues extends YupValues<Schema> = YupValues<Schema>,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ChakraFormControlProps {
  name: TName;
  schema: Schema;
  control: Control<TFieldValues>;
  type?: HTMLInputTypeAttribute;
  inputProps?: Omit<InputProps, 'type'>;
}

export const FormControl = <Schema extends yup.AnyObjectSchema>({
  name,
  control,
  schema,
  type,
  inputProps,
  ...chakraProps
}: FormControlProps<Schema>) => {
  const { field, fieldState, formState } = useController<YupValues<Schema>>({ name, control });

  const yupFields = useMemo<SchemaDescription | undefined>(() => {
    let yupName = name as string;
    if (name.includes('.')) yupName = withFilter(name);
    if (isFieldArray(yupName)) yupName = toFieldArray(name);

    const fields = schema.describe().fields;

    return get(fields, yupName) as SchemaDescription;
  }, [name, schema]);

  const isRequiredYup = useMemo(
    () => !!yupFields?.tests?.find(({ name: testName }) => testName === 'required'),
    [yupFields],
  );

  return (
    <ChakraFormControl
      isInvalid={fieldState.invalid}
      isRequired={isRequiredYup}
      isDisabled={formState.isSubmitting}
      {...chakraProps}
    >
      <FormLabel>{yupFields?.label ?? upperFirst(name)}</FormLabel>

      <Input {...inputProps} {...field} id={name} type={type ?? 'text'} />

      <FormErrorMessage>{(fieldState.error as any)?.message}</FormErrorMessage>
    </ChakraFormControl>
  );
};

const withFilter = (val: string) => val.split('.').join('.fields.');
const isFieldArray = (val: string) => /.*\.\d\.?/.test(val);
const toFieldArray = (val: string) => {
  const [fieldArrayName, ...restFieldArrayNames] = val.split('.');
  const withoutNumbers = restFieldArrayNames.filter(
    (maybeNumber) => !Number.isInteger(parseFloat(maybeNumber)),
  );

  return [fieldArrayName, 'innerType', 'fields', ...withoutNumbers].join('.');
};
