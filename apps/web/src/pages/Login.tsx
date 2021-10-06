import { Button, Container, Heading, VStack } from '@chakra-ui/react';
import { emailAuthSchema, IEmailAuthValues } from '@lib/schema';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { FormControl } from '../components/form/form-control';
import { useHookForm } from '../hooks';
import { useStore } from '../stores';

export const LoginPage = observer(() => {
  const rootStore = useStore();
  const [{ handleSubmit, formState }, formProps] = useHookForm({ schema: emailAuthSchema });

  const onSubmit = async (values: IEmailAuthValues) => {
    console.log({ values });
    const res = await rootStore.auth.login(values);
    console.log({ res });
  };

  return (
    <Container paddingTop={8}>
      <VStack as="form" onSubmit={handleSubmit(onSubmit)} spacing={8}>
        <Heading>Login</Heading>

        <FormControl {...formProps} name="email" inputProps={{ autoComplete: 'username' }} />

        <FormControl
          {...formProps}
          name="password"
          type="password"
          inputProps={{ autoComplete: 'current-password' }}
        />

        <Button type="submit" isDisabled={formState.isSubmitting}>
          Submit
        </Button>
      </VStack>
    </Container>
  );
});
