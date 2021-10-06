import { extendTheme, withDefaultColorScheme, ThemeOverride } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';

// DOC: https://chakra-ui.com/docs/theming/customize-theme#using-theme-extensions
// src: https://github.com/chakra-ui/chakra-ui/tree/main/packages/theme/src/foundations
export const theme = extendTheme(
  {
    styles: {
      global: (props: Dict<unknown>) => ({
        body: {
          fontFamily: 'body',
          color: mode('gray.800', 'whiteAlpha.900')(props),
          bg: mode('white', 'gray.800')(props),
          lineHeight: 'base',
        },
      }),
    },
    config: {
      initialColorMode: 'light',
      useSystemColorMode: false,
    },
  } as ThemeOverride,
  withDefaultColorScheme({ colorScheme: 'primary' }),
);
