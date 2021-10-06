import React, { StrictMode } from 'react';
import ReactDom from 'react-dom';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { theme } from './theme';
import { StoreProvider } from './stores';
import { Routes } from './router';

ReactDom.render(
  <StrictMode>
    <StoreProvider>
      <ChakraProvider theme={theme}>
        <CSSReset />

        <Router>
          <Routes />
        </Router>
      </ChakraProvider>
    </StoreProvider>
  </StrictMode>,
  document.getElementById('root'),
);
