import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Center,
  VStack,
  HStack,
  Flex,
  Spacer,
  Heading,
  Skeleton,
} from '@chakra-ui/react';
import { fetchActiveWeather } from './weatherSlice';
import HourlySlider from './HourlySlider';
import DailyForecast from './DailyForecast';
import { formatMtoKm, formatSpeedMtoKm } from '../util/util';
import WeatherSub from './WeatherSub';

function WeatherMain() {
  const dispatch = useDispatch();
  const activeLocation = "30.0443879-31.2357257"; // Cairo, EG

  useEffect(() => {
    dispatch(fetchActiveWeather(activeLocation));
  }, [dispatch, activeLocation]);

  return (
    <Flex direction="column" flex={1}>
      <WeatherHeader
        location={activeLocation}
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

function WeatherHeader() {
  const currentWeather = useSelector(state => state.weather.current);
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
          {/* {`${location?.name}, ${location?.country}`} */}
          Cairo, EG
        </Heading>
        <HStack>
          <Skeleton
            isLoaded={weather}
            fadeDuration={2}
          >
            <img
              src={cloudIcon}
              alt={`${'icon'}`}
              width={65}
              height={65}
              className="curr-icon"
            />
          </Skeleton>
          <Skeleton
            isLoaded={temp}
            fadeDuration={2}
          >
            <Heading as="h2" size="4xl" align="center" className="curr-temp">
              {`${Math.round(temp)}\u00b0`}
            </Heading>
          </Skeleton>
        </HStack>
        <Spacer />
        <HStack spacing={['1rem', '2rem']} className="curr_weather">
          <Heading as="h3" size="xs" align="left">
            Feels like
            <Skeleton
              isLoaded={feels_like}
              fadeDuration={2}
            >
              {`${Math.round(feels_like)}\u00b0`}
            </Skeleton>
          </Heading>
          <Heading as="h3" size="xs" align="left">
            Wind
            <Skeleton
              isLoaded={feels_like}
              fadeDuration={2}
            >
              {`${formatSpeedMtoKm(wind_speed)} km/h`}
            </Skeleton>
          </Heading>
          <Heading as="h3" size="xs" align="left">
            Visibility
            <Skeleton
              isLoaded={feels_like}
              fadeDuration={2}
            >
              {`${formatMtoKm(visibility)} km`}
            </Skeleton>
          </Heading>
        </HStack>
        <Spacer />
        <HStack spacing={['.75rem', '2rem']} className="curr_weather">
          <Heading as="h3" size="xs" align="left">
            Pressure
            <Skeleton
              isLoaded={feels_like}
              fadeDuration={2}
            >
              {`${Math.round(pressure)} mb`}
            </Skeleton>
          </Heading>
          <Heading as="h3" size="xs" align="left">
            Humidity
            <Skeleton
              isLoaded={feels_like}
              fadeDuration={2}
            >
              {`${Math.round(humidity)}%`}
            </Skeleton>
          </Heading>
          <Heading as="h3" size="xs" align="left">
            Dew Point
            <Skeleton
              isLoaded={feels_like}
              fadeDuration={2}
            >
              {`${Math.round(dew_point)}\u00b0`}
            </Skeleton>
          </Heading>
        </HStack>
      </VStack>
    </Center>
  );
}
export default WeatherMain;
