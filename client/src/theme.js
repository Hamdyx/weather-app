import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  cssVarPrefix: 'ck',
};

const styles = {
  global: props => ({
    body: {
      color: mode('black', 'blue.100')(props),
      bg: mode('gray.200', 'blue.800')(props),
    },
    p: {
      color: mode('black', 'blue.50')(props),
    },
  }),
};

const theme = extendTheme({
  config,
  styles,
  layerStyles: {
    hourly: {
      bg: 'gray.50',
      borderTop: '2px solid',
      borderBottom: '2px solid',
      borderColor: 'gray.500',
    },
    selected: {
      bg: 'teal.500',
      color: 'teal.700',
      borderColor: 'orange.500',
    },
  },
  colors: {
    transparent: 'transparent',
    black: '#000',
    white: '#fff',

    gray: {
      50: '#0b1d354d',
      // ...
      900: '#171923',
    },

    blue: {
      50: '#eaeef3',
    },

    components: {
      Text: {
        color: mode('whiteAlpha.900', 'gray.900'),
      },
      Box: {
        variants: {
          outline: {
            border: '2px solid',
            borderColor: 'purple.500',
            color: 'purple.500',
          },
          solid: {
            bg: 'purple.500',
            color: 'white',
          },
        },
        // The default size and variant values
        defaultProps: {
          size: 'md',
          variant: 'outline',
        },
      },
    },
  },
});

export default theme;
