import { extendTheme, withDefaultColorScheme, theme as baseTheme, ThemeOverride } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';

// DOC: https://chakra-ui.com/docs/theming/customize-theme#using-theme-extensions
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
    colors: {
      primary: baseTheme.colors.teal,
    },
    config: {
      useSystemColorMode: true,
    },
  } as ThemeOverride,
  withDefaultColorScheme({ colorScheme: 'primary' }),
);
