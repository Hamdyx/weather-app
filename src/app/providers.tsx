'use client';

import { Provider } from 'react-redux';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { Analytics } from '@vercel/analytics/react';

import { store } from './store';
import theme from '../theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        {children}
      </ChakraProvider>
      <Analytics />
    </Provider>
  );
}
