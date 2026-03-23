import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  globalCss: {
    body: {
      colorPalette: 'blue',
    },
  },
  theme: {
    tokens: {
      colors: {
        blue: {
          50: { value: '#eaeef3' },
        },
        gray: {
          50: { value: '#0b1d354d' },
          900: { value: '#171923' },
        },
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
      },
    },
    layerStyles: {
      hourly: {
        value: {
          bg: '{colors.gray.50}',
          borderTop: '2px solid',
          borderBottom: '2px solid',
          borderColor: '{colors.gray.500}',
        },
      },
      selected: {
        value: {
          bg: '{colors.teal.500}',
          color: '{colors.teal.700}',
          borderColor: '{colors.orange.500}',
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
