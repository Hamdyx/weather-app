import type { Metadata } from 'next';

import { Providers } from './providers';

import './global.css';

export const metadata: Metadata = {
  title: 'Weather App',
  description: 'Web site created with Next.js.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div id="root">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
