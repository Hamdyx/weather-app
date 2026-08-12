import type { RootState } from '@/store';

import { ChakraProvider } from '@chakra-ui/react';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';
import { describe, expect, it } from 'vitest';

import { system } from '@/theme';

import weatherReducer from '../weatherSlice';
import WeatherHeader from './WeatherHeader';

const failedState: RootState = {
  weather: {
    activeLocation: { lat: 30.0443879, lon: 31.2357257, name: 'Cairo, EG' },
    main: null,
    weather: null,
    visibility: 0,
    wind: null,
    clouds: 0,
    hourly: [],
    timezoneOffsetSeconds: null,
    location: null,
    currentStatus: 'failed',
    currentError: 'Request failed with status 401',
    currentRequestId: null,
    forecastStatus: 'failed',
    forecastError: 'Request failed with status 401',
    forecastRequestId: null,
  },
};

function renderWithProviders() {
  const store = configureStore({
    reducer: { weather: weatherReducer },
    preloadedState: failedState,
  });

  return render(
    <ReduxProvider store={store}>
      <ChakraProvider value={system}>
        <WeatherHeader />
      </ChakraProvider>
    </ReduxProvider>,
  );
}

describe('WeatherHeader — failed state', () => {
  it('shows placeholder dashes instead of fabricated data', () => {
    renderWithProviders();

    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });

  it('never renders a fabricated 0° temperature', () => {
    renderWithProviders();

    expect(screen.queryByText('0°')).not.toBeInTheDocument();
  });
});
