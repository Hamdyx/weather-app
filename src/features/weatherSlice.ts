import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { RootState } from '@/app/store';

import type {
  ForecastWeather,
  Location,
  MainWeather,
  WeatherCondition,
  Wind,
} from './types';

const ApiKey = process.env.NEXT_PUBLIC_API_KEY;
const WeatherEndpoint = process.env.NEXT_PUBLIC_WEATHER_API_URL;
const ForecastEndpoint = process.env.NEXT_PUBLIC_FORECAST_API_URL;

type SliceState = {
  activeLocation: string;
  main: MainWeather | null;
  weather: WeatherCondition[] | null;
  visibility: number;
  wind: Wind | null;
  rain?: number;
  clouds?: number;
  hourly: ForecastWeather[];
  location: Location | null;
  loading: boolean;
  error: string | undefined;
};

const initialState: SliceState = {
  activeLocation: '30.0443879-31.2357257', // Cairo, EG
  main: null,
  weather: null,
  visibility: 0,
  wind: null,
  rain: 0,
  clouds: 0,
  hourly: [],
  location: null,
  loading: false,
  error: undefined,
};

export const fetchActiveWeather = createAsyncThunk<
  {
    main: MainWeather;
    weather: WeatherCondition[];
    location: Location;
    visibility: number;
    wind: Wind;
    clouds?: number;
  },
  void,
  {
    state: RootState;
  }
>('weather/fetchActiveWeather', async (_, thunkapi) => {
  const coord = thunkapi.getState().weather.activeLocation;
  const [lat, lon] = coord.split('-');
  const results = await axios.get(
    `${WeatherEndpoint}?lat=${lat}&lon=${lon}&appid=${ApiKey}&units=metric`,
  );

  const { main, weather, sys, visibility, wind, clouds } = results.data;

  return {
    main,
    weather,
    location: sys,
    visibility,
    wind,
    clouds: clouds.all,
  };
});

export const fetchForecast = createAsyncThunk<
  {
    list: ForecastWeather[];
  },
  void,
  {
    state: RootState;
  }
>('weather/fetchForecast', async (_, thunkapi) => {
  const coord = thunkapi.getState().weather.activeLocation;
  const [lat, lon] = coord.split('-');
  const results = await axios.get(
    `${ForecastEndpoint}?lat=${lat}&lon=${lon}&appid=${ApiKey}&units=metric`,
  );

  const { list } = results.data;

  return {
    list,
  };
});

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    locationAdded() {},
    locationUpdated(state, action) {
      state.activeLocation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveWeather.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActiveWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchActiveWeather.fulfilled, (state, action) => {
        state.loading = false;
        const { main, weather, location, visibility, wind, clouds } =
          action.payload;
        state.main = { ...main };
        state.weather = { ...weather };
        state.location = { ...location };
        state.visibility = visibility;
        state.wind = { ...wind };
        state.clouds = clouds;
      })
      .addCase(fetchForecast.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.loading = false;
        const { list } = action.payload;
        state.hourly = [...list];
      });
  },
});

export const { locationAdded, locationUpdated } = weatherSlice.actions;

export default weatherSlice.reducer;
