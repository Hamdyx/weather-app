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
} from '@chakra-ui/react';
import { LuRefreshCw } from 'react-icons/lu';
import { RootState, useAppDispatch } from '@/app/store';
import { formatMtoKm, formatSpeedMtoKm } from '../util/util';
import { fetchActiveWeather } from './weatherSlice';
import { toaster } from '../components/ui/toaster';

function WeatherHeader() {
  const { current: currentWeather, loading } = useSelector(
    (state: RootState) => state.weather,
  );
  const dispatch = useAppDispatch();

  const {
    temp = 0,
    feels_like = 0,
    wind_speed = 0,
    visibility = 0,
    pressure = 0,
    humidity = 0,
    dew_point = 0,
    weather,
  } = currentWeather || {};

  const cloudIcon = weather ? `icons/${weather[0].icon}.png` : `icons/11n.png`;

  const updateWeather = () => {
    dispatch(fetchActiveWeather())
      .unwrap()
      .then(() => {
        toaster.success({
          title: 'Weather Updated.',
          duration: 3000,
        });
      })
      .catch(() => {
        toaster.error({
          title: 'Error Updating Weather.',
          duration: 3000,
        });
      });
  };

  return (
    <Center p={4}>
      <VStack gap="1rem">
        <HStack gap={4}>
          <Heading as="h1" size="lg">
            Cairo, EG
          </Heading>
          <Button onClick={updateWeather}>
            {loading ? <Spinner size="sm" /> : <LuRefreshCw />}
          </Button>
        </HStack>
        <HStack>
          <Skeleton loading={loading}>
            <img
              src={cloudIcon}
              alt={`${'icon'}`}
              width={65}
              height={65}
              className="curr-icon"
            />
          </Skeleton>
          <Skeleton loading={loading}>
            <Heading as="h2" size="4xl" className="curr-temp">
              {`${Math.round(temp)}\u00b0`}
            </Heading>
          </Skeleton>
        </HStack>
        <Spacer />
        <HStack gap={['1rem', '2rem']} className="curr_weather">
          <Heading as="h3" size="xs">
            Feels like
            <Skeleton loading={loading}>
              {`${Math.round(feels_like)}\u00b0`}
            </Skeleton>
          </Heading>
          <Heading as="h3" size="xs">
            Wind
            <Skeleton loading={loading}>
              {`${formatSpeedMtoKm(wind_speed)} km/h`}
            </Skeleton>
          </Heading>
          <Heading as="h3" size="xs">
            Visibility
            <Skeleton loading={loading}>
              {`${formatMtoKm(visibility)} km`}
            </Skeleton>
          </Heading>
        </HStack>
        <Spacer />
        <HStack gap={['.75rem', '2rem']} className="curr_weather">
          <Heading as="h3" size="xs">
            Pressure
            <Skeleton loading={loading}>
              {`${Math.round(pressure)} mb`}
            </Skeleton>
          </Heading>
          <Heading as="h3" size="xs">
            Humidity
            <Skeleton loading={loading}>{`${Math.round(humidity)}%`}</Skeleton>
          </Heading>
          <Heading as="h3" size="xs">
            Dew Point
            <Skeleton loading={loading}>
              {`${Math.round(dew_point)}\u00b0`}
            </Skeleton>
          </Heading>
        </HStack>
      </VStack>
    </Center>
  );
}

export default WeatherHeader;
