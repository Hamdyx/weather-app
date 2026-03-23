'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { Analytics } from '@vercel/analytics/next';
import { Provider as ReduxProvider } from 'react-redux';

import { store } from './store';
import { ColorModeProvider } from '../components/ui/color-mode';
import { Toaster } from '../components/ui/toaster';
import { system } from '../theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ChakraProvider value={system}>
        <ColorModeProvider>
          {children}
          <Toaster />
        </ColorModeProvider>
      </ChakraProvider>
      <Analytics />
    </ReduxProvider>
  );
}
