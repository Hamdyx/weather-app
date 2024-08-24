import type { Metadata } from 'next';
import React, { StrictMode } from 'react';

import App from '../App';

export const metadata: Metadata = {
  title: 'Weather App',
  description: 'Web site created with Next.js.',
};

function HomePage() {
  return (
    <main>
      <div id="root">
        <StrictMode>
          <App />
        </StrictMode>
      </div>
    </main>
  );
}

export default HomePage;
