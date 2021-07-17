import React, { StrictMode } from 'react';
import ReactDom from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './components/App';
import { theme as baseTheme } from './theme';

ReactDom.render(
  <StrictMode>
    <ChakraProvider theme={baseTheme}>
      <App />
    </ChakraProvider>
  </StrictMode>,
  document.getElementById('root'),
);
