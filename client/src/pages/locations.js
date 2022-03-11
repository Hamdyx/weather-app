import Head from 'next/head';
import React, { StrictMode } from 'react';

function LocationsHead() {
  return (
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <meta
        name="description"
        content="Weather app locations page, search for a location with city, state or latitude and longitude"
      />
      <title>Locations</title>
    </Head>
  );
}

function Locations() {
  return (
    <main>
      <LocationsHead />

      <StrictMode>Locations Page</StrictMode>
    </main>
  );
}

export default Locations;
