import type {
  Coordinates,
  CurrentWeatherResponse,
  ForecastResponse,
} from './types';

type ApiConfig = {
  weatherEndpoint: string;
  forecastEndpoint: string;
  apiKey: string;
};

/**
 * Reads the OpenWeatherMap configuration. The `process.env.NEXT_PUBLIC_*`
 * accesses must stay literal — Next.js only inlines statically analysable
 * reads into the client bundle. Resolved per call so a missing variable
 * surfaces as a rejected request instead of a blank page at import time.
 */
function getApiConfig(): ApiConfig {
  const weatherEndpoint = process.env.NEXT_PUBLIC_WEATHER_API_URL;
  const forecastEndpoint = process.env.NEXT_PUBLIC_FORECAST_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const missing = [
    !weatherEndpoint && 'NEXT_PUBLIC_WEATHER_API_URL',
    !forecastEndpoint && 'NEXT_PUBLIC_FORECAST_API_URL',
    !apiKey && 'NEXT_PUBLIC_API_KEY',
  ].filter(Boolean);

  if (!weatherEndpoint || !forecastEndpoint || !apiKey) {
    throw new Error(
      `Missing environment variable(s): ${missing.join(', ')}. ` +
        'Copy .env.example to .env, fill in the values, and rebuild.',
    );
  }

  return { weatherEndpoint, forecastEndpoint, apiKey };
}

function buildUrl(endpoint: string, coords: Coordinates, apiKey: string) {
  const params = new URLSearchParams({
    lat: String(coords.lat),
    lon: String(coords.lon),
    appid: apiKey,
    units: 'metric',
  });

  return `${endpoint}?${params.toString()}`;
}

function isCurrentWeatherResponse(
  data: unknown,
): data is CurrentWeatherResponse {
  if (!data || typeof data !== 'object') return false;
  const { main, weather, sys, timezone } = data as Record<string, unknown>;

  return (
    !!main &&
    typeof main === 'object' &&
    typeof (main as Record<string, unknown>).temp === 'number' &&
    Array.isArray(weather) &&
    !!sys &&
    typeof sys === 'object' &&
    typeof timezone === 'number'
  );
}

function isForecastResponse(data: unknown): data is ForecastResponse {
  if (!data || typeof data !== 'object') return false;
  const { list, city } = data as Record<string, unknown>;

  return (
    Array.isArray(list) &&
    !!city &&
    typeof city === 'object' &&
    typeof (city as Record<string, unknown>).timezone === 'number'
  );
}

/**
 * Parses an error response body for OpenWeatherMap's `{ cod, message }`
 * shape. Returns null on any parse failure so the caller can fall back to
 * the plain status message instead of masking it.
 */
async function readErrorMessage(response: Response): Promise<string | null> {
  try {
    const body: unknown = await response.json();
    if (
      body &&
      typeof body === 'object' &&
      typeof (body as Record<string, unknown>).message === 'string'
    ) {
      return (body as { message: string }).message;
    }
    return null;
  } catch {
    return null;
  }
}

async function requestJson<T>(
  url: string,
  validate: (data: unknown) => data is T,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    const bodyMessage = await readErrorMessage(response);
    throw new Error(
      bodyMessage
        ? `Weather request failed (${response.status}): ${bodyMessage}`
        : `Weather request failed with status ${response.status} ${response.statusText}`.trim(),
    );
  }

  const data: unknown = await response.json();
  if (!validate(data)) {
    throw new Error('Unexpected response shape from weather API');
  }

  return data;
}

export function fetchCurrentWeather(
  coords: Coordinates,
  signal?: AbortSignal,
): Promise<CurrentWeatherResponse> {
  const { weatherEndpoint, apiKey } = getApiConfig();

  return requestJson(
    buildUrl(weatherEndpoint, coords, apiKey),
    isCurrentWeatherResponse,
    signal,
  );
}

export function fetchForecastData(
  coords: Coordinates,
  signal?: AbortSignal,
): Promise<ForecastResponse> {
  const { forecastEndpoint, apiKey } = getApiConfig();

  return requestJson(
    buildUrl(forecastEndpoint, coords, apiKey),
    isForecastResponse,
    signal,
  );
}
