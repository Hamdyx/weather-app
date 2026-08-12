import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type {
  Coordinates,
  ForecastWeather,
  LocationInfo,
  MainWeather,
  WeatherCondition,
  Wind,
} from './types';

import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';

import { groupForecastByCityDay } from './forecast';
import { fetchCurrentWeather, fetchForecastData } from './weatherApi';

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type SliceState = {
  activeLocation: { lat: number; lon: number; name: string };
  main: MainWeather | null;
  weather: WeatherCondition[] | null;
  visibility: number;
  wind: Wind | null;
  clouds?: number;
  hourly: ForecastWeather[];
  timezoneOffsetSeconds: number | null;
  location: LocationInfo | null;
  currentStatus: RequestStatus;
  currentError: string | undefined;
  currentRequestId: string | null;
  forecastStatus: RequestStatus;
  forecastError: string | undefined;
  forecastRequestId: string | null;
};

const initialState: SliceState = {
  activeLocation: { lat: 30.0443879, lon: 31.2357257, name: 'Cairo, EG' },
  main: null,
  weather: null,
  visibility: 0,
  wind: null,
  clouds: 0,
  hourly: [],
  timezoneOffsetSeconds: null,
  location: null,
  currentStatus: 'idle',
  currentError: undefined,
  currentRequestId: null,
  forecastStatus: 'idle',
  forecastError: undefined,
  forecastRequestId: null,
};

export const fetchActiveWeather = createAsyncThunk<
  {
    main: MainWeather;
    weather: WeatherCondition[];
    location: LocationInfo;
    visibility: number;
    wind: Wind;
    clouds?: number;
    timezone: number;
  },
  Coordinates
>('weather/fetchActiveWeather', async ({ lat, lon }, thunkapi) => {
  const { main, weather, sys, visibility, wind, clouds, timezone } =
    await fetchCurrentWeather({ lat, lon }, thunkapi.signal);

  return {
    main,
    weather,
    location: sys,
    visibility,
    wind,
    clouds: clouds?.all,
    timezone,
  };
});

export const fetchForecast = createAsyncThunk<
  {
    list: ForecastWeather[];
    timezone: number;
  },
  Coordinates
>('weather/fetchForecast', async ({ lat, lon }, thunkapi) => {
  const { list, city } = await fetchForecastData({ lat, lon }, thunkapi.signal);

  return { list, timezone: city.timezone };
});

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    locationUpdated(
      state,
      action: PayloadAction<SliceState['activeLocation']>,
    ) {
      state.activeLocation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveWeather.pending, (state, action) => {
        state.currentRequestId = action.meta.requestId;
        state.currentStatus = 'loading';
        state.currentError = undefined;
      })
      .addCase(fetchActiveWeather.rejected, (state, action) => {
        // Results of a superseded request must not touch the state.
        if (action.meta.requestId !== state.currentRequestId) return;
        state.currentRequestId = null;
        if (action.meta.aborted) {
          state.currentStatus = 'idle';
          return;
        }
        state.currentStatus = 'failed';
        state.currentError = action.error.message;
      })
      .addCase(fetchActiveWeather.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.currentRequestId) return;
        const { main, weather, location, visibility, wind, clouds, timezone } =
          action.payload;
        state.currentRequestId = null;
        state.currentStatus = 'succeeded';
        state.currentError = undefined;
        state.main = main;
        state.weather = weather;
        state.location = location;
        state.visibility = visibility;
        state.wind = wind;
        state.clouds = clouds;
        state.timezoneOffsetSeconds = timezone;
      })
      .addCase(fetchForecast.pending, (state, action) => {
        state.forecastRequestId = action.meta.requestId;
        state.forecastStatus = 'loading';
        state.forecastError = undefined;
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        if (action.meta.requestId !== state.forecastRequestId) return;
        state.forecastRequestId = null;
        if (action.meta.aborted) {
          state.forecastStatus = 'idle';
          return;
        }
        state.forecastStatus = 'failed';
        state.forecastError = action.error.message;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.forecastRequestId) return;
        const { list, timezone } = action.payload;
        state.forecastRequestId = null;
        state.forecastStatus = 'succeeded';
        state.forecastError = undefined;
        state.hourly = list;
        state.timezoneOffsetSeconds = timezone;
      });
  },
});

export const { locationUpdated } = weatherSlice.actions;

export const HOURLY_SLOT_COUNT = 5;

export const selectHourly = (state: RootState) => state.weather.hourly;

export const selectTimezoneOffsetSeconds = (state: RootState) =>
  state.weather.timezoneOffsetSeconds;

export const selectForecastStatus = (state: RootState) =>
  state.weather.forecastStatus;

export const selectDailyForecast = createSelector(
  [selectHourly, selectTimezoneOffsetSeconds],
  (list, timezoneOffsetSeconds) =>
    groupForecastByCityDay(list, timezoneOffsetSeconds ?? 0),
);

export const selectHourlySlots = createSelector([selectHourly], (list) =>
  list.slice(0, HOURLY_SLOT_COUNT),
);

export default weatherSlice.reducer;
