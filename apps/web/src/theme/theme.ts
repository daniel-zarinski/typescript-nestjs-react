import { extendTheme, withDefaultColorScheme, theme as baseTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

export const theme = extendTheme(
  {
    styles: {
      global: (props) => ({
        body: {
          fontFamily: 'body',
          color: mode('gray.800', 'whiteAlpha.900')(props),
          bg: mode('white', 'gray.800')(props),
          lineHeight: 'base',
        },
      }),
    },
    colors: {
      primary: baseTheme.colors.teal,
    },
    config: {
      useSystemColorMode: true,
    },
  },
  withDefaultColorScheme({ colorScheme: 'primary' }),
);
