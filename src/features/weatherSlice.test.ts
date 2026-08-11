import type { CurrentWeatherResponse } from './types';

import { configureStore } from '@reduxjs/toolkit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import weatherReducer, {
  fetchActiveWeather,
  fetchForecast,
  locationUpdated,
} from './weatherSlice';

const currentPayload: CurrentWeatherResponse = {
  main: {
    temp: 21,
    feels_like: 20,
    temp_min: 19,
    temp_max: 23,
    pressure: 1012,
    humidity: 40,
  },
  weather: [
    { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
    { id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' },
  ],
  sys: { type: 1, id: 1, country: 'EG', sunrise: 1000, sunset: 2000 },
  visibility: 10000,
  wind: { speed: 3.5, deg: 180, gust: 5 },
  clouds: { all: 12 },
};

const fulfilledCurrent = () =>
  fetchActiveWeather.fulfilled(
    {
      main: currentPayload.main,
      weather: currentPayload.weather,
      location: currentPayload.sys,
      visibility: currentPayload.visibility,
      wind: currentPayload.wind,
      clouds: currentPayload.clouds?.all,
    },
    'request-current',
    undefined,
  );

const fulfilledForecast = () =>
  fetchForecast.fulfilled(
    { list: [], daily: [] },
    'request-forecast',
    undefined,
  );

describe('weatherSlice — fulfilled shape', () => {
  it('stores weather as an array', () => {
    const state = weatherReducer(undefined, fulfilledCurrent());

    expect(Array.isArray(state.weather)).toBe(true);
    expect(state.weather).toEqual(currentPayload.weather);
    expect(state.weather?.[0].icon).toBe('01d');
  });

  it('stores the remaining current-weather fields', () => {
    const state = weatherReducer(undefined, fulfilledCurrent());

    expect(state.main).toEqual(currentPayload.main);
    expect(state.location).toEqual(currentPayload.sys);
    expect(state.wind).toEqual(currentPayload.wind);
    expect(state.visibility).toBe(10000);
    expect(state.clouds).toBe(12);
  });
});

describe('weatherSlice — per-request status', () => {
  it('starts both requests idle', () => {
    const state = weatherReducer(undefined, { type: '@@INIT' });

    expect(state.currentStatus).toBe('idle');
    expect(state.forecastStatus).toBe('idle');
  });

  it('tracks the current-weather request without touching the forecast', () => {
    const pending = weatherReducer(
      undefined,
      fetchActiveWeather.pending('request-current', undefined),
    );
    expect(pending.currentStatus).toBe('loading');
    expect(pending.forecastStatus).toBe('idle');

    const fulfilled = weatherReducer(pending, fulfilledCurrent());
    expect(fulfilled.currentStatus).toBe('succeeded');
    expect(fulfilled.currentError).toBeUndefined();
    expect(fulfilled.forecastStatus).toBe('idle');
  });

  it('tracks the forecast request without touching the current weather', () => {
    const pending = weatherReducer(
      undefined,
      fetchForecast.pending('request-forecast', undefined),
    );
    expect(pending.forecastStatus).toBe('loading');
    expect(pending.currentStatus).toBe('idle');

    const fulfilled = weatherReducer(pending, fulfilledForecast());
    expect(fulfilled.forecastStatus).toBe('succeeded');
    expect(fulfilled.currentStatus).toBe('idle');
  });

  it('records the error message on rejection', () => {
    const state = weatherReducer(
      undefined,
      fetchActiveWeather.rejected(
        new Error('Request failed with status 401'),
        'request-current',
        undefined,
      ),
    );

    expect(state.currentStatus).toBe('failed');
    expect(state.currentError).toBe('Request failed with status 401');
  });

  it('does not let one request clobber the other status', () => {
    const succeeded = weatherReducer(undefined, fulfilledForecast());
    expect(succeeded.forecastStatus).toBe('succeeded');

    const rejected = weatherReducer(
      succeeded,
      fetchActiveWeather.rejected(
        new Error('Request failed with status 500'),
        'request-current',
        undefined,
      ),
    );

    expect(rejected.currentStatus).toBe('failed');
    expect(rejected.currentError).toBe('Request failed with status 500');
    expect(rejected.forecastStatus).toBe('succeeded');
    expect(rejected.forecastError).toBeUndefined();
  });
});

describe('locationUpdated', () => {
  it('replaces the active location coordinates', () => {
    const state = weatherReducer(
      undefined,
      locationUpdated({ lat: -33.86, lon: 151.2, name: 'Sydney, AU' }),
    );

    expect(state.activeLocation).toEqual({
      lat: -33.86,
      lon: 151.2,
      name: 'Sydney, AU',
    });
  });
});

describe('request URLs', () => {
  let requestedUrls: string[] = [];

  beforeEach(() => {
    requestedUrls = [];
    vi.stubEnv(
      'NEXT_PUBLIC_WEATHER_API_URL',
      'https://api.example.com/data/2.5/weather',
    );
    vi.stubEnv(
      'NEXT_PUBLIC_FORECAST_API_URL',
      'https://api.example.com/data/2.5/forecast',
    );
    vi.stubEnv('NEXT_PUBLIC_API_KEY', 'test-key');
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) => {
        requestedUrls.push(String(input));
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(currentPayload),
        } as Response);
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('sends negative coordinates unmangled', async () => {
    const store = configureStore({ reducer: { weather: weatherReducer } });
    store.dispatch(
      locationUpdated({ lat: -33.86, lon: 151.2, name: 'Sydney, AU' }),
    );

    await store.dispatch(fetchActiveWeather());

    expect(requestedUrls).toHaveLength(1);
    expect(requestedUrls[0]).toContain('lat=-33.86');
    expect(requestedUrls[0]).toContain('lon=151.2');
    expect(requestedUrls[0]).toContain('units=metric');
    expect(store.getState().weather.currentStatus).toBe('succeeded');
  });

  it('sends the default Cairo coordinates', async () => {
    const store = configureStore({ reducer: { weather: weatherReducer } });

    await store.dispatch(fetchActiveWeather());

    expect(requestedUrls[0]).toContain('lat=30.0443879');
    expect(requestedUrls[0]).toContain('lon=31.2357257');
  });
});
