import type { Metadata } from 'next';

import Layout from '@/components/Layout';

import { Providers } from './providers';

import './global.css';

export const metadata: Metadata = {
  title: {
    default: 'Weather App',
    template: '%s | Weather App',
  },
  description: 'Current conditions and forecast for your location.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
