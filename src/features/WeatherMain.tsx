'use client';

import { Flex, Spacer } from '@chakra-ui/react';
import { useEffect } from 'react';

import { useAppDispatch } from '@/app/store';

import DailyForecast from './DailyForecast';
import HourlySlider from './HourlySlider';
import WeatherHeader from './WeatherHeader';
import { fetchActiveWeather, fetchForecast } from './weatherSlice';
import WeatherSub from './WeatherSub';

function WeatherMain() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchActiveWeather());
    dispatch(fetchForecast());
  }, [dispatch]);

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
