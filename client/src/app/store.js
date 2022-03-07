import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '../features/weatherSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
});
