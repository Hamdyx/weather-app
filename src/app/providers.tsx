'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import { Analytics } from '@vercel/analytics/next';

import { store } from './store';
import { system } from '../theme';
import { ColorModeProvider } from '../components/ui/color-mode';
import { Toaster } from '../components/ui/toaster';

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
