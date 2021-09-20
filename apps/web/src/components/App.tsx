import { Button, Heading, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useStore } from '../stores';

const App = () => {
  const rootStore = useStore();
  const [click, setClick] = useState(false);

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
          setClick(!click);
          const { token } = rootStore.auth;

          console.log({ token });

          await rootStore.auth.refreshToken();
        }}
      >
        <Text>{click ? 'true' : 'false'}</Text>
      </Button>
    </VStack>
  );
};

export default App;
