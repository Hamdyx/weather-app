import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type {
  DailyForecastItem,
  ForecastWeather,
  LocationInfo,
  MainWeather,
  WeatherCondition,
  Wind,
} from './types';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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
  daily: DailyForecastItem[];
  location: LocationInfo | null;
  currentStatus: RequestStatus;
  currentError: string | undefined;
  forecastStatus: RequestStatus;
  forecastError: string | undefined;
};

const initialState: SliceState = {
  activeLocation: { lat: 30.0443879, lon: 31.2357257, name: 'Cairo, EG' },
  main: null,
  weather: null,
  visibility: 0,
  wind: null,
  clouds: 0,
  hourly: [],
  daily: [],
  location: null,
  currentStatus: 'idle',
  currentError: undefined,
  forecastStatus: 'idle',
  forecastError: undefined,
};

export const fetchActiveWeather = createAsyncThunk<
  {
    main: MainWeather;
    weather: WeatherCondition[];
    location: LocationInfo;
    visibility: number;
    wind: Wind;
    clouds?: number;
  },
  void,
  {
    state: RootState;
  }
>('weather/fetchActiveWeather', async (_, thunkapi) => {
  const { lat, lon } = thunkapi.getState().weather.activeLocation;
  const { main, weather, sys, visibility, wind, clouds } =
    await fetchCurrentWeather({ lat, lon }, thunkapi.signal);

  return {
    main,
    weather,
    location: sys,
    visibility,
    wind,
    clouds: clouds?.all,
  };
});

export const fetchForecast = createAsyncThunk<
  {
    list: ForecastWeather[];
    daily: DailyForecastItem[];
  },
  void,
  {
    state: RootState;
  }
>('weather/fetchForecast', async (_, thunkapi) => {
  const { lat, lon } = thunkapi.getState().weather.activeLocation;
  const { list } = await fetchForecastData({ lat, lon }, thunkapi.signal);

  // Group forecast items by day and compute min/max temps
  const grouped = new Map<
    string,
    { items: ForecastWeather[]; min: number; max: number }
  >();

  for (const item of list) {
    const day = item.dt_txt.split(' ')[0];
    const entry = grouped.get(day);
    if (entry) {
      entry.items.push(item);
      entry.min = Math.min(entry.min, item.main.temp_min);
      entry.max = Math.max(entry.max, item.main.temp_max);
    } else {
      grouped.set(day, {
        items: [item],
        min: item.main.temp_min,
        max: item.main.temp_max,
      });
    }
  }

  const daily: DailyForecastItem[] = Array.from(grouped.values()).map(
    ({ items, min, max }) => {
      // Pick the midday entry (closest to 12:00) as representative weather
      const midday =
        items.find((i) => i.dt_txt.includes('12:00:00')) ?? items[0];
      return {
        dt: midday.dt,
        weather: midday.weather,
        temp: { min, max },
      };
    },
  );

  return { list, daily };
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
      .addCase(fetchActiveWeather.pending, (state) => {
        state.currentStatus = 'loading';
        state.currentError = undefined;
      })
      .addCase(fetchActiveWeather.rejected, (state, action) => {
        state.currentStatus = 'failed';
        state.currentError = action.error.message;
      })
      .addCase(fetchActiveWeather.fulfilled, (state, action) => {
        const { main, weather, location, visibility, wind, clouds } =
          action.payload;
        state.currentStatus = 'succeeded';
        state.currentError = undefined;
        state.main = main;
        state.weather = weather;
        state.location = location;
        state.visibility = visibility;
        state.wind = wind;
        state.clouds = clouds;
      })
      .addCase(fetchForecast.pending, (state) => {
        state.forecastStatus = 'loading';
        state.forecastError = undefined;
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.forecastStatus = 'failed';
        state.forecastError = action.error.message;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        const { list, daily } = action.payload;
        state.forecastStatus = 'succeeded';
        state.forecastError = undefined;
        state.hourly = list;
        state.daily = daily;
      });
  },
});

export const { locationUpdated } = weatherSlice.actions;

export default weatherSlice.reducer;
