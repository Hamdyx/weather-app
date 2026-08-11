'use client';

import type { ThemeProviderProps } from 'next-themes';

import { ClientOnly, IconButton, Skeleton } from '@chakra-ui/react';
import { Moon, Sun } from 'lucide-react';
import { ThemeProvider, useTheme } from 'next-themes';

export function ColorModeProvider(props: ThemeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      defaultTheme="system"
      {...props}
    />
  );
}

export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleColorMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return {
    colorMode: resolvedTheme,
    setColorMode: setTheme,
    toggleColorMode,
  };
}

export function ColorModeButton() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Toggle color mode"
        size="sm"
      >
        {colorMode === 'light' ? <Moon /> : <Sun />}
      </IconButton>
    </ClientOnly>
  );
}
