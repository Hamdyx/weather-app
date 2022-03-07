import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  nanoid,
} from '@reduxjs/toolkit';

const axios = require('axios');

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

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    weatherAdded: {
      reducer(state, action) {
        state.weather.daily.push(action.payload);
        // weatherAdapter.addOne
      },
      prepare(title, content) {
        return {
          payload: {
            errorid: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
          },
        };
      },
    },
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
  },
});

// console.log(weatherSlice);

export const { displayWeather } = weatherSlice.actions;

export default weatherSlice.reducer;

export const { selectAll, selectById, selectIds } = weatherAdapter.getSelectors(
  state => state.weather
);
