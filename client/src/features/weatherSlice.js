import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';

const axios = require('axios');
const weatherApi = 'http://127.0.0.1:8000/api/v1/weather';

const weatherAdapter = createEntityAdapter({
  // selectId: (item) => item.customId
});

const initialState = weatherAdapter.getInitialState({
  activeLocation: '',
  current: {},
  hourly: [],
  daily: [],
  status: 'idle',
  error: null,
});

export const fetchCurrentWeather = createAsyncThunk(
  'weather/fetchCurrentWeather',
  async () => {
    const response = await axios.get(`${weatherApi}/current`);
    /* 
    clouds,
    dew_point,
    dt,
    feels_like,
    humidity,
    pressure,
    sunrise,
    sunset,
    temp,
    uvi,
    visibility,
    weather = [{id, main, description, icon}],
    wind_deg,
    wind_speed,
     */
    return response.data.data;
  }
);

export const fetchActiveWeather = createAsyncThunk(
  'weather/fetchActiveWeather',
  async coord => {
    const response = await axios.get(`${weatherApi}/oneCall/${coord}`);
    console.log(response);
    return response.data.data;
  }
);

export const fetchHourlyWeather = createAsyncThunk(
  'weather/fetchHourlyWeather',
  async () => {
    const response = await axios.get(`${weatherApi}/hourly`);

    return response.data.data; // {0: {}, 1: {}}
  }
);

export const fetchDailyWeather = createAsyncThunk(
  'weather/fetchDailyWeather',
  async () => {
    const response = await axios.get(`${weatherApi}/daily`);

    return response.data.data; // {0: {}, 1: {}}
  }
);

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    locationAdded: {
      reducer(state, action) {
        weatherAdapter.addOne(state, action.payload);
      },
    },
    locationUpdated: {
      reducer(state, action) {
        state.activeLocation = action.payload;
      },
    },
  },
  extraReducers: {
    // Active location weather
    [fetchActiveWeather.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchActiveWeather.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      console.log(action.payload);
      state.current = { ...action.payload.current };
      state.hourly = { ...action.payload.hourly };
      state.daily = { ...action.payload.daily };
    },
    [fetchActiveWeather.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    // Current weather
    [fetchCurrentWeather.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchCurrentWeather.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.current = { ...action.payload };
    },
    [fetchCurrentWeather.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    // Hourly weather
    [fetchHourlyWeather.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchHourlyWeather.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.hourly = { ...action.payload };
    },
    [fetchHourlyWeather.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    // Daily weather
    [fetchDailyWeather.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchDailyWeather.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.daily = { ...action.payload };
    },
    [fetchDailyWeather.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
  },
});

export const { locationAdded, locationUpdated } = weatherSlice.actions;

export default weatherSlice.reducer;

// Export the customized selectors for this adapter using `getSelectors`
export const {
  selectAll: selectAllLocation,
  selectById: selectLocationById,
  selectIds: selectLocationsIds,
  // Pass in a selector that returns the posts slice of state
} = weatherAdapter.getSelectors(state => state.weather);
