import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';

const axios = require('axios');
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const endpoint = 'https://api.openweathermap.org/data/2.5/onecall?';
const weatherAdapter = createEntityAdapter({});

const initialState = weatherAdapter.getInitialState({
  activeLocation: '',
  current: {},
  hourly: [],
  daily: [],
  status: 'idle',
  error: null,
});

export const fetchActiveWeather = createAsyncThunk(
  'weather/fetchActiveWeather',
  async coord => {
    const [lat, lon] = coord.split('-');
    const results = await axios.get(
      `${endpoint}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const { current, daily, hourly } = results.data
    return { current, daily, hourly };
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
    [fetchActiveWeather.pending]: (state) => {
      state.status = 'loading';
    },
    [fetchActiveWeather.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    [fetchActiveWeather.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.current = { ...action.payload.current };
      state.hourly = { ...action.payload.hourly };
      state.daily = { ...action.payload.daily };
    },
  },
});

export const { locationAdded, locationUpdated } = weatherSlice.actions;

export default weatherSlice.reducer;

export const {
  selectAll: selectAllLocation,
  selectById: selectLocationById,
  selectIds: selectLocationsIds,
} = weatherAdapter.getSelectors(state => state.weather);
