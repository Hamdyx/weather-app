'use client';

import { Flex, Spacer } from '@chakra-ui/react';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/store';

import DailyForecast from './DailyForecast';
import HourlySlider from './HourlySlider';
import WeatherHeader from './WeatherHeader';
import WeatherSub from './WeatherSub';
import { fetchActiveWeather, fetchForecast } from '../weatherSlice';

function WeatherMain() {
  const dispatch = useAppDispatch();
  const lat = useAppSelector((state) => state.weather.activeLocation.lat);
  const lon = useAppSelector((state) => state.weather.activeLocation.lon);

  useEffect(() => {
    const currentPromise = dispatch(fetchActiveWeather({ lat, lon }));
    const forecastPromise = dispatch(fetchForecast({ lat, lon }));

    // Aborting on cleanup cancels in-flight requests when the location
    // changes and keeps StrictMode's double mount from double-fetching.
    return () => {
      currentPromise.abort();
      forecastPromise.abort();
    };
  }, [dispatch, lat, lon]);

  return (
    <Flex direction="column" flex={1}>
      <WeatherHeader />
      <Spacer />
      <HourlySlider />
      <Spacer />
      <DailyForecast />
      <Spacer />
      <WeatherSub />
    </Flex>
  );
}

export default WeatherMain;
