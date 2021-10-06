import { Button, Heading, Text, VStack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useStore } from '../stores';

export const App = observer(() => {
  const rootStore = useStore();

  useEffect(() => {
    const interval = setInterval(() => {
      if (rootStore.auth.canRefreshToken) rootStore.auth.refreshToken();
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [rootStore.auth]);

  return (
    <VStack flex={1} my={8}>
      <Heading>Welcome!</Heading>
      <Text>Date : {new Date().toDateString()}</Text>
      <Button
        onClick={async () => {
          await rootStore.auth.logout();
        }}
      >
        <Text>Logout</Text>
      </Button>
    </VStack>
  );
});
