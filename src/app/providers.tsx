'use client';

import { Provider } from 'react-redux';
import {
  ChakraProvider,
  cookieStorageManagerSSR,
  localStorageManager,
} from '@chakra-ui/react';
import { Analytics } from '@vercel/analytics/next';

import { store } from './store';

import theme from '../theme';

export function Providers({ children }: { children: React.ReactNode }) {
  const colorModeManager =
    cookieStorageManagerSSR('chakra-ui-color-mode') ?? localStorageManager;

  return (
    <Provider store={store}>
      <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
        {children}
      </ChakraProvider>
      <Analytics />
    </Provider>
  );
}
