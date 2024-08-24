import type { Metadata } from 'next';
import React from 'react';

import LocationsMain from '../../features/locations/LocationsMain.js';

export const metadata: Metadata = {
  title: 'Locations',
  description: 'Web site created with Next.js.',
};

function Locations() {
  return (
    <main>
      <LocationsMain />
    </main>
  );
}

export default Locations;
