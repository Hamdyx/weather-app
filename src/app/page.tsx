import type { Metadata } from 'next';
import React, { StrictMode } from 'react';

import WeatherMain from 'features/WeatherMain';

export const metadata: Metadata = {
  title: 'Weather App',
  description: 'Web site created with Next.js.',
};

function HomePage() {
  return (
    <main>
      <div id="root">
        <StrictMode>
          <WeatherMain />
        </StrictMode>
      </div>
    </main>
  );
}

export default HomePage;
