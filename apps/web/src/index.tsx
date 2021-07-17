import React, { StrictMode } from 'react';
import ReactDom from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './components/App';
import { theme } from './theme';

ReactDom.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </StrictMode>,
  document.getElementById('root'),
);
