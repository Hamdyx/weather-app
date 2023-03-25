import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import axios from 'axios';

const ApiKey = process.env.NEXT_PUBLIC_API_KEY;
const Endpoint = process.env.NEXT_PUBLIC_API_URL;

type SliceState = {
  activeLocation: string;
  current: any;
  hourly: any[];
  daily: any[];
  loading: boolean;
  error: string | undefined;
};

const initialState: SliceState = {
  activeLocation: '30.0443879-31.2357257', // Cairo, EG
  current: {},
  hourly: [],
  daily: [],
  loading: false,
  error: undefined,
};

export const fetchActiveWeather = createAsyncThunk<
  any,
  void,
  {
    state: RootState;
  }
>('weather/fetchActiveWeather', async (_, thunkapi) => {
  const coord = thunkapi.getState().weather.activeLocation;
  const [lat, lon] = coord.split('-');
  const results = await axios.get(
    `${Endpoint}lat=${lat}&lon=${lon}&appid=${ApiKey}&units=metric`
  );
  const { current, daily, hourly } = results.data;
  return { current, daily, hourly };
});

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    locationAdded(state, action) {
      // weatherAdapter.addOne(state, action.payload);
    },
    locationUpdated(state, action) {
      state.activeLocation = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchActiveWeather.pending, state => {
        state.loading = true;
      })
      .addCase(fetchActiveWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchActiveWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.current = { ...action.payload.current };
        state.hourly = { ...action.payload.hourly };
        state.daily = { ...action.payload.daily };
      });
  },
});

export const { locationAdded, locationUpdated } = weatherSlice.actions;

export default weatherSlice.reducer;

// export const {
//   selectAll: selectAllLocation,
//   selectById: selectLocationById,
//   selectIds: selectLocationsIds,
// } = weatherAdapter.getSelectors(state => state.weather);
