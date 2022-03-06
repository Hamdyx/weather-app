import { VStack, HStack, Flex, Spacer, Heading } from '@chakra-ui/react';

import WeatherSub from './WeatherSub';
import HourlySlider from './HourlySlider';
import DailyForecast from './DailyForecast';
import { formatMtoKm, formatSpeedMtoKm } from '../util/util';
const axios = require('axios');

function WeatherMain() {
  const fetchCurrentData = async () => {
    const res = await axios.get(
      'http://127.0.0.1:8000/api/v1/weather/current/'
    );

    const current = res.data.data;

    updateCurrentUI(current);
  };

  const updateCurrentUI = info => {
    if (Object.keys(info).length === 0) return;
    const {
      temp,
      feels_like,
      wind_speed,
      visibility,
      pressure,
      humidity,
      dew_point,
    } = info;

    document.querySelector('.curr-temp').textContent = `${Math.round(
      temp
    )}\u00b0`;

    document.querySelector(
      '.curr-feelsLike'
    ).textContent = `Feels like ${Math.round(feels_like)}\u00b0`;

    document.querySelector('.curr-wind').textContent = `Wind ${formatSpeedMtoKm(
      wind_speed
    )} km/h`;

    document.querySelector(
      '.curr-visibility'
    ).textContent = `Visibility ${formatMtoKm(visibility)} km`;

    document.querySelector(
      '.curr-pressure'
    ).textContent = `Pressure ${Math.round(pressure)} mb`;

    document.querySelector(
      '.curr-humidity'
    ).textContent = `Humidity ${Math.round(humidity)}%`;

    document.querySelector(
      '.curr-dewpoint'
    ).textContent = `Dew Point ${Math.round(dew_point)}\u00b0`;
  };
  fetchCurrentData();
  // update data every 5 minutes
  // setInterval(fetchData, 1000);
  return (
    <Flex direction="column" flex={1} p={0}>
      <WeatherHeader location="Cairo, EG" data={{ temp: 10, feelsLike: 10 }} />
      <HourlySlider />
      <Spacer />
      <DailyForecast />

      <WeatherSub />
    </Flex>
  );
}

function WeatherHeader(props) {
  return (
    <VStack spacing={8} align="left" p={4}>
      <Heading as="h1" size="lg" align="left">
        {props.location}
      </Heading>
      <Heading as="h2" size="4xl" align="left" className="curr-temp">
        {props.temp}
      </Heading>
      <HStack>
        <Heading as="h3" size="sm" align="left" className="curr-feelsLike">
          Feels like {props.feelsLike}
        </Heading>
        <Heading as="h3" size="sm" align="left" className="curr-wind">
          Wind {props.feelsLike}
        </Heading>
        <Heading as="h3" size="sm" align="left" className="curr-visibility">
          Visibility {props.feelsLike}
        </Heading>
      </HStack>
      <HStack>
        <Heading as="h3" size="sm" align="left" className="curr-pressure">
          Pressure {props.feelsLike}
        </Heading>
        <Heading as="h3" size="sm" align="left" className="curr-humidity">
          Humidity {props.feelsLike}
        </Heading>
        <Heading as="h3" size="sm" align="left" className="curr-dewpoint">
          Dew Point {props.feelsLike}
        </Heading>
      </HStack>
    </VStack>
  );
}
export default WeatherMain;
