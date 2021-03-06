import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Center,
  VStack,
  HStack,
  Flex,
  Spacer,
  Heading,
} from '@chakra-ui/react';
import { fetchActiveWeather, selectLocationById } from './weatherSlice';
import HourlySlider from './HourlySlider';
import DailyForecast from './DailyForecast';
import { formatMtoKm, formatSpeedMtoKm } from '../util/util';
import WeatherSub from './WeatherSub';

function WeatherMain() {
  const dispatch = useDispatch();
  const activeLocation = useSelector(state => state.weather.activeLocation);

  useEffect(() => {
    // fetch all weather data and forecast
    dispatch(fetchActiveWeather(activeLocation));
  }, [dispatch, activeLocation]);

  return (
    <Flex direction="column" flex={1}>
      <WeatherHeader
        location={activeLocation}
        data={{ temp: 10, feelsLike: 10 }}
      />
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
  const location = useSelector(state =>
    selectLocationById(state, props.location)
  );
  const currentWeather = useSelector(state => state.weather.current);
  console.log('WeatherHeader');
  console.log(location);
  const {
    temp,
    feels_like,
    wind_speed,
    visibility,
    pressure,
    humidity,
    dew_point,
    weather,
  } = currentWeather;

  const cloudIcon = weather ? `icons/${weather[0].icon}.png` : `icons/11n.png`;
  return (
    <Center p={4}>
      <VStack spacing="1rem">
        <Heading as="h1" size="lg">
          {`${location.name}, ${location.country}`}
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
            {`${Math.round(temp)}\u00b0`}
          </Heading>
        </HStack>
        <Spacer />

        <HStack spacing={['1rem', '2rem']}>
          <Heading as="h3" size="xs" align="left" className="curr-feelsLike">
            Feels like {`${Math.round(feels_like)}\u00b0`}
          </Heading>
          <Heading as="h3" size="xs" align="left" className="curr-wind">
            Wind {`${formatSpeedMtoKm(wind_speed)} km/h`}
          </Heading>
          <Heading as="h3" size="xs" align="left" className="curr-visibility">
            Visibility {`${formatMtoKm(visibility)} km`}
          </Heading>
        </HStack>
        <Spacer />
        <HStack spacing={['.75rem', '2rem']}>
          <Heading as="h3" size="xs" align="left" className="curr-pressure">
            Pressure {`${Math.round(pressure)} mb`}
          </Heading>
          <Heading as="h3" size="xs" align="left" className="curr-humidity">
            Humidity {`${Math.round(humidity)}%`}
          </Heading>
          <Heading as="h3" size="xs" align="left" className="curr-dewpoint">
            Dew Point {`${Math.round(dew_point)}\u00b0`}
          </Heading>
        </HStack>
      </VStack>
    </Center>
  );
}
export default WeatherMain;
