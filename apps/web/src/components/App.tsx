import { Heading, Text, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    console.log('hello1');
  }, []);

  return (
    <VStack flex={1} my={8}>
      <Heading>Welcome!</Heading>
      <Text>Date : {new Date().toDateString()}</Text>
    </VStack>
  );
};

export default App;
