import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  nanoid,
} from '@reduxjs/toolkit';

const axios = require('axios');
const weatherApi = 'http://127.0.0.1:8000/api/v1/weather';

const weatherAdapter = createEntityAdapter({
  // selectId: (item) => item.customId
});

const initialState = weatherAdapter.getInitialState({
  current: {},
  hourly: [],
  daily: [],
  status: 'idle',
  error: null,
});

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchAll',
  async () => {
    // const response = await axios.get(weatherApi)
    // return response.data.data.weatherData
    console.log('fetchWeatherData');
  }
);

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

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    /* weatherAdded: {
      reducer(state, action) {
        state.weather.daily.push(action.payload);
        // weatherAdapter.addOne
      },
      prepare(title, content) {
        return {
          payload: {
            
            date: new Date().toISOString(),
            title,
            content,
          },
        };
      },
    }, */
  },
  extraReducers: {
    [fetchWeatherData.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchWeatherData.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      weatherAdapter.upsertMany(state, action.payload);
    },
    [fetchWeatherData.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
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
  },
});

// console.log(weatherSlice);

/* export const { weatherAdded } = weatherSlice.actions; */

export default weatherSlice.reducer;

/* export const { selectAll, selectById, selectIds } = weatherAdapter.getSelectors(
  state => state.weather
);
 */

export const { selectCurrent } = weatherAdapter.getSelectors(
  state => state.weather.current
);
