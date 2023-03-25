import { useSelector } from 'react-redux';
import {
  Center,
  VStack,
  HStack,
  Spacer,
  Heading,
  Skeleton,
  Button,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { RootState, useAppDispatch } from 'app/store';
import { formatMtoKm, formatSpeedMtoKm } from '../util/util';
import { RepeatIcon } from '@chakra-ui/icons';
import { fetchActiveWeather } from './weatherSlice';

function WeatherHeader() {
  const { current: currentWeather, loading } = useSelector(
    (state: RootState) => state.weather
  );
  const dispatch = useAppDispatch();
  const toast = useToast();

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

  const updateWeather = (ev: any) => {
    console.log('updateWeather', { ev });
    dispatch(fetchActiveWeather())
      .unwrap()
      .then(() => {
        toast({
          title: 'Weather Updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(() => {
        toast({
          title: 'Error Updating Weather.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Center p={4}>
      <VStack spacing="1rem">
        <HStack spacing={4}>
          <Heading as="h1" size="lg">
            Cairo, EG
          </Heading>
          <Button onClick={updateWeather}>
            {loading ? <Spinner size="sm" /> : <RepeatIcon />}
          </Button>
        </HStack>
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
