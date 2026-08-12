import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  globalCss: {
    body: {
      colorPalette: 'blue',
    },
  },
  theme: {
    tokens: {
      sizes: {
        navbarHeight: { value: '50px' },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: {
            value: { _light: '{colors.gray.200}', _dark: '{colors.blue.800}' },
          },
        },
        fg: {
          DEFAULT: {
            value: { _light: '{colors.black}', _dark: '{colors.blue.50}' },
          },
        },
        surface: {
          translucent: {
            value: { _light: '#f7fafc4d', _dark: '#0b1d354d' },
          },
        },
      },
    },
    layerStyles: {
      hourly: {
        value: {
          bg: 'surface.translucent',
          borderTop: '2px solid',
          borderBottom: '2px solid',
          borderColor: '{colors.gray.500}',
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
