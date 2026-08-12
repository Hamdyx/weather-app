import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchCurrentWeather, fetchForecastData } from './weatherApi';

const COORDS = { lat: 30.0443879, lon: 31.2357257 };

const validCurrentWeather = {
  main: {
    temp: 21,
    feels_like: 20,
    temp_min: 19,
    temp_max: 23,
    pressure: 1012,
    humidity: 40,
  },
  weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
  sys: { country: 'EG', sunrise: 1000, sunset: 2000 },
  wind: { speed: 3.5, deg: 180 },
  timezone: 10800,
};

const validForecast = {
  list: [],
  city: { timezone: 10800 },
};

function stubFetchOnce(response: Partial<Response> & { ok: boolean }) {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.resolve(response as Response)),
  );
}

describe('weatherApi', () => {
  beforeEach(() => {
    vi.stubEnv(
      'NEXT_PUBLIC_WEATHER_API_URL',
      'https://api.example.com/data/2.5/weather',
    );
    vi.stubEnv(
      'NEXT_PUBLIC_FORECAST_API_URL',
      'https://api.example.com/data/2.5/forecast',
    );
    vi.stubEnv('NEXT_PUBLIC_API_KEY', 'test-key');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('resolves the parsed body on the happy path', async () => {
    stubFetchOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(validCurrentWeather),
    });

    await expect(fetchCurrentWeather(COORDS)).resolves.toEqual(
      validCurrentWeather,
    );
  });

  it('resolves the parsed forecast body on the happy path', async () => {
    stubFetchOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(validForecast),
    });

    await expect(fetchForecastData(COORDS)).resolves.toEqual(validForecast);
  });

  it('surfaces the OpenWeatherMap error message when the body has one', async () => {
    stubFetchOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: () =>
        Promise.resolve({ cod: 401, message: 'Invalid API key. Please...' }),
    });

    await expect(fetchCurrentWeather(COORDS)).rejects.toThrow(
      'Invalid API key. Please...',
    );
  });

  it('falls back to the status text when the error body cannot be parsed', async () => {
    stubFetchOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: () => Promise.reject(new Error('not json')),
    });

    await expect(fetchCurrentWeather(COORDS)).rejects.toThrow(
      'Weather request failed with status 500 Internal Server Error',
    );
  });

  it('rejects with a shape error when weather is not an array', async () => {
    stubFetchOnce({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({ ...validCurrentWeather, weather: undefined }),
    });

    await expect(fetchCurrentWeather(COORDS)).rejects.toThrow(
      'Unexpected response shape from weather API',
    );
  });

  it('rejects with a shape error when city.timezone is missing', async () => {
    stubFetchOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ list: [], city: {} }),
    });

    await expect(fetchForecastData(COORDS)).rejects.toThrow(
      'Unexpected response shape from weather API',
    );
  });

  it('names the missing environment variables', async () => {
    vi.unstubAllEnvs();
    vi.stubEnv('NEXT_PUBLIC_WEATHER_API_URL', '');
    vi.stubEnv('NEXT_PUBLIC_FORECAST_API_URL', '');
    vi.stubEnv('NEXT_PUBLIC_API_KEY', '');

    await expect(async () => fetchCurrentWeather(COORDS)).rejects.toThrow(
      'Missing environment variable(s): NEXT_PUBLIC_WEATHER_API_URL, NEXT_PUBLIC_FORECAST_API_URL, NEXT_PUBLIC_API_KEY.',
    );
  });
});
