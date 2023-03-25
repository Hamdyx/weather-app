import { useSelector } from 'react-redux';
import {
  Center,
  VStack,
  HStack,
  Spacer,
  Heading,
  Skeleton,
} from '@chakra-ui/react';
import { RootState } from 'app/store';
import { formatMtoKm, formatSpeedMtoKm } from '../util/util';

function WeatherHeader() {
  const currentWeather = useSelector(
    (state: RootState) => state.weather.current
  );
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
          Cairo, EG
        </Heading>
        <HStack>
          <Skeleton isLoaded={weather} fadeDuration={2}>
            <img
              src={cloudIcon}
              alt={`${'icon'}`}
              width={65}
              height={65}
              className="curr-icon"
            />
          </Skeleton>
          <Skeleton isLoaded={temp} fadeDuration={2}>
            <Heading as="h2" size="4xl" className="curr-temp">
              {`${Math.round(temp)}\u00b0`}
            </Heading>
          </Skeleton>
        </HStack>
        <Spacer />
        <HStack spacing={['1rem', '2rem']} className="curr_weather">
          <Heading as="h3" size="xs">
            Feels like
            <Skeleton isLoaded={feels_like} fadeDuration={2}>
              {`${Math.round(feels_like)}\u00b0`}
            </Skeleton>
          </Heading>
          <Heading as="h3" size="xs">
            Wind
            <Skeleton isLoaded={feels_like} fadeDuration={2}>
              {`${formatSpeedMtoKm(wind_speed)} km/h`}
            </Skeleton>
          </Heading>
          <Heading as="h3" size="xs">
            Visibility
            <Skeleton isLoaded={feels_like} fadeDuration={2}>
              {`${formatMtoKm(visibility)} km`}
            </Skeleton>
          </Heading>
        </HStack>
        <Spacer />
        <HStack spacing={['.75rem', '2rem']} className="curr_weather">
          <Heading as="h3" size="xs">
            Pressure
            <Skeleton isLoaded={feels_like} fadeDuration={2}>
              {`${Math.round(pressure)} mb`}
            </Skeleton>
          </Heading>
          <Heading as="h3" size="xs">
            Humidity
            <Skeleton isLoaded={feels_like} fadeDuration={2}>
              {`${Math.round(humidity)}%`}
            </Skeleton>
          </Heading>
          <Heading as="h3" size="xs">
            Dew Point
            <Skeleton isLoaded={feels_like} fadeDuration={2}>
              {`${Math.round(dew_point)}\u00b0`}
            </Skeleton>
          </Heading>
        </HStack>
      </VStack>
    </Center>
  );
}

export default WeatherHeader;
