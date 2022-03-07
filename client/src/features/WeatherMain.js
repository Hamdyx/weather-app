import {
  Center,
  VStack,
  HStack,
  Flex,
  Spacer,
  Heading,
} from '@chakra-ui/react';
import HourlySlider from './HourlySlider';
import DailyForecast from './DailyForecast';
import { formatMtoKm, formatSpeedMtoKm } from '../util/util';
import WeatherSub from './WeatherSub';

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
      weather,
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

    const cloudIcon = `icons/${weather[0].icon}.png`;
    console.log(document.querySelector('.curr-icon'));
    document.querySelector('.curr-icon').src = `${cloudIcon}`;
  };
  fetchCurrentData();
  // update data every 5 minutes
  // setInterval(fetchData, 1000);
  return (
    <Flex direction="column" flex={1}>
      <WeatherHeader location="Cairo, EG" data={{ temp: 10, feelsLike: 10 }} />
      <Spacer />
      <HourlySlider />
      <Spacer />
      <DailyForecast />
      <Spacer />
      <WeatherSub />
    </Flex>
  );
}

function WeatherHeader(props) {
  const cloudIcon = `icons/11n.png`;
  return (
    <Center p={4}>
      <VStack spacing="1rem">
        <Heading as="h1" size="lg">
          {props.location}
        </Heading>
        <HStack>
          <img
            src={cloudIcon}
            alt={`${'icon'}`}
            width={65}
            height={65}
            className="curr-icon"
          />
          <Heading as="h2" size="4xl" align="center" className="curr-temp">
            {props.temp}
          </Heading>
        </HStack>
        <Spacer />

        <HStack spacing="2rem">
          <Heading as="h3" size="xs" align="left" className="curr-feelsLike">
            Feels like {props.feelsLike}
          </Heading>
          <Heading as="h3" size="xs" align="left" className="curr-wind">
            Wind {props.feelsLike}
          </Heading>
          <Heading as="h3" size="xs" align="left" className="curr-visibility">
            Visibility {props.feelsLike}
          </Heading>
        </HStack>
        <Spacer />
        <HStack spacing="2rem">
          <Heading as="h3" size="xs" align="left" className="curr-pressure">
            Pressure {props.feelsLike}
          </Heading>
          <Heading as="h3" size="xs" align="left" className="curr-humidity">
            Humidity {props.feelsLike}
          </Heading>
          <Heading as="h3" size="xs" align="left" className="curr-dewpoint">
            Dew Point {props.feelsLike}
          </Heading>
        </HStack>
      </VStack>
    </Center>
  );
}
export default WeatherMain;
