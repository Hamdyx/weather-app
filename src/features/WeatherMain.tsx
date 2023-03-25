import { useEffect } from 'react';
import { Flex, Spacer } from '@chakra-ui/react';
import { useAppDispatch } from 'app/store';
import { fetchActiveWeather } from './weatherSlice';
import HourlySlider from './HourlySlider';
import DailyForecast from './DailyForecast';
import WeatherSub from './WeatherSub';
import WeatherHeader from './WeatherHeader';

function WeatherMain() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchActiveWeather());
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
