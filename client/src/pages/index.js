import Head from 'next/head';
import React, { StrictMode } from 'react';
import App from '../App';

function HomeHead() {
  return (
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <meta
        name="description"
        content="Web site created using create-react-app"
      />
      <title>Weather App</title>
    </Head>
  );
}

function HomePage() {
  return (
    <main>
      <HomeHead />
      <div id="root">
        <StrictMode>
          <App />
        </StrictMode>
      </div>
    </main>
  );
}

export default HomePage;
