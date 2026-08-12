import type { CurrentWeatherResponse, ForecastWeather } from './types';

import { configureStore } from '@reduxjs/toolkit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import weatherReducer, {
  fetchActiveWeather,
  fetchForecast,
  locationUpdated,
  selectDailyForecast,
  selectHourlySlots,
  selectTimezoneOffsetSeconds,
} from './weatherSlice';

const CAIRO = { lat: 30.0443879, lon: 31.2357257 };

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
  timezone: 10800,
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
      timezone: currentPayload.timezone,
    },
    'request-current',
    CAIRO,
  );

const FORECAST_TIMEZONE_SECONDS = 7200;

const fulfilledForecast = (list: ForecastWeather[] = []) =>
  fetchForecast.fulfilled(
    { list, timezone: FORECAST_TIMEZONE_SECONDS },
    'request-forecast',
    CAIRO,
  );

const makeSlot = (dt: number, temp: number): ForecastWeather => ({
  dt,
  main: {
    temp,
    feels_like: temp,
    temp_min: temp - 1,
    temp_max: temp + 1,
    pressure: 1012,
    humidity: 40,
  },
  weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
  clouds: { all: 10 },
  wind: { speed: 3, deg: 90, gust: 4 },
  visibility: 10000,
  pop: 0,
  sys: { pod: 'd' },
  dt_txt: '',
});

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
      fetchActiveWeather.pending('request-current', CAIRO),
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
      fetchForecast.pending('request-forecast', CAIRO),
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
        CAIRO,
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
        CAIRO,
      ),
    );

    expect(rejected.currentStatus).toBe('failed');
    expect(rejected.currentError).toBe('Request failed with status 500');
    expect(rejected.forecastStatus).toBe('succeeded');
    expect(rejected.forecastError).toBeUndefined();
  });
});

describe('weatherSlice — timezone offset', () => {
  it('stores the offset from the forecast thunk', () => {
    const state = weatherReducer(undefined, fulfilledForecast());

    expect(selectTimezoneOffsetSeconds({ weather: state })).toBe(
      FORECAST_TIMEZONE_SECONDS,
    );
  });

  it('stores the offset from the current-weather thunk', () => {
    const state = weatherReducer(undefined, fulfilledCurrent());

    expect(selectTimezoneOffsetSeconds({ weather: state })).toBe(
      currentPayload.timezone,
    );
  });
});

describe('weatherSlice — derived forecast selectors', () => {
  // 16 x 3h slots from city-local midnight: two full days at UTC+2.
  const firstCityMidnight = Date.UTC(2024, 0, 14, 22, 0) / 1000;
  const slots = Array.from({ length: 16 }, (_, i) =>
    makeSlot(firstCityMidnight + i * 3 * 60 * 60, 20 + i),
  );

  const stateWithForecast = () => ({
    weather: weatherReducer(undefined, fulfilledForecast(slots)),
  });

  it('derives city-day groups from the stored list and offset', () => {
    const daily = selectDailyForecast(stateWithForecast());

    expect(daily.length).toBeGreaterThan(0);

    const dateKeys = daily.map((day) => day.dateKey);
    expect(new Set(dateKeys).size).toBe(dateKeys.length);
  });

  it('memoizes: repeated calls on the same state return the same reference', () => {
    const state = stateWithForecast();

    expect(selectDailyForecast(state)).toBe(selectDailyForecast(state));
    expect(selectHourlySlots(state)).toBe(selectHourlySlots(state));
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

    await store.dispatch(fetchActiveWeather({ lat: -33.86, lon: 151.2 }));

    expect(requestedUrls).toHaveLength(1);
    expect(requestedUrls[0]).toContain('lat=-33.86');
    expect(requestedUrls[0]).toContain('lon=151.2');
    expect(requestedUrls[0]).toContain('units=metric');
    expect(store.getState().weather.currentStatus).toBe('succeeded');
  });

  it('sends the coordinates it was called with', async () => {
    const store = configureStore({ reducer: { weather: weatherReducer } });

    await store.dispatch(fetchActiveWeather(CAIRO));

    expect(requestedUrls[0]).toContain('lat=30.0443879');
    expect(requestedUrls[0]).toContain('lon=31.2357257');
  });
});
