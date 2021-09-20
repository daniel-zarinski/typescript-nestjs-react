import React, { StrictMode } from 'react';
import ReactDom from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './components/App';
import { theme } from './theme';
import { StoreProvider } from './stores';

ReactDom.render(
  <StrictMode>
    <StoreProvider>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </StoreProvider>
  </StrictMode>,
  document.getElementById('root'),
);
