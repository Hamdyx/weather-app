import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import weatherReducer from '../features/weatherSlice';

const reducer = {
  weather: weatherReducer,
};

export const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
