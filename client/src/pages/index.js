import Head from 'next/head';
import React, { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import App from '../App';
import { ColorModeScript } from '@chakra-ui/react';
import theme from '../theme';
import reportWebVitals from '../reportWebVitals';

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
          <Provider store={store}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <App />
          </Provider>
        </StrictMode>
      </div>
    </main>
  );
}

export default HomePage;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
