'use client';

import {
  Center,
  VStack,
  HStack,
  Spacer,
  Heading,
  Skeleton,
  Button,
  Spinner,
  Image,
} from '@chakra-ui/react';
import { RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

import { toaster } from '@/components/ui/toaster';
import { useAppDispatch, useAppSelector } from '@/store';
import { formatMpsToKmh, formatMtoKm } from '@/util/format';

import { weatherIconPath } from '../icons';
import { fetchActiveWeather, fetchForecast } from '../weatherSlice';
import DataStack from './DataStack';

function WeatherHeader() {
  const main = useAppSelector((state) => state.weather.main);
  const weather = useAppSelector((state) => state.weather.weather);
  const visibility = useAppSelector((state) => state.weather.visibility);
  const wind = useAppSelector((state) => state.weather.wind);
  const clouds = useAppSelector((state) => state.weather.clouds);
  const locationName = useAppSelector(
    (state) => state.weather.activeLocation.name,
  );
  const currentStatus = useAppSelector((state) => state.weather.currentStatus);
  const currentError = useAppSelector((state) => state.weather.currentError);
  const forecastStatus = useAppSelector(
    (state) => state.weather.forecastStatus,
  );
  const forecastError = useAppSelector((state) => state.weather.forecastError);
  const dispatch = useAppDispatch();

  // 'idle' counts as loading so the first paint shows skeletons, not 0°
  const loading = currentStatus === 'idle' || currentStatus === 'loading';
  const refreshing =
    currentStatus === 'loading' || forecastStatus === 'loading';

  const { temp = 0, feels_like = 0, pressure = 0, humidity = 0 } = main || {};
  const { speed = 0 } = wind || {};

  const cloudIcon = weatherIconPath(weather?.[0]?.icon);

  // A pending request always passes through 'loading' first, so entering
  // 'failed' changes these deps and the toast fires once per failure.
  useEffect(() => {
    if (currentStatus !== 'failed' && forecastStatus !== 'failed') return;

    toaster.error({
      title: 'Error Updating Weather.',
      description: currentError ?? forecastError,
      duration: 5000,
    });
  }, [currentStatus, forecastStatus, currentError, forecastError]);

  const updateWeather = () => {
    Promise.all([
      dispatch(fetchActiveWeather()).unwrap(),
      dispatch(fetchForecast()).unwrap(),
    ])
      .then(() => {
        toaster.success({
          title: 'Weather Updated.',
          duration: 3000,
        });
      })
      .catch(() => {
        // Failures are surfaced by the status effect above.
      });
  };

  return (
    <Center p={4}>
      <VStack gap="1rem">
        <HStack gap={4}>
          <Heading as="h1" size="lg">
            {locationName}
          </Heading>
          <Button
            onClick={updateWeather}
            variant="plain"
            size="sm"
            aria-label="Refresh weather"
          >
            {refreshing ? <Spinner size="sm" /> : <RefreshCw />}
          </Button>
        </HStack>
        <HStack>
          <Skeleton loading={loading}>
            <Image
              src={cloudIcon}
              alt={weather?.[0]?.description ?? ''}
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
        <HStack gap={['1rem', '2rem']}>
          <DataStack
            className="feels-like-data"
            title="Feels like"
            value={`${Math.round(feels_like)}\u00b0`}
            loading={loading}
          />
          <DataStack
            className="wind-data"
            title="Wind"
            value={`${formatMpsToKmh(speed)} km/h`}
            loading={loading}
          />
          <DataStack
            className="visibility-data"
            title="Visibility"
            value={`${formatMtoKm(visibility)} km`}
            loading={loading}
          />
        </HStack>
        <Spacer />
        <HStack gap={['.75rem', '2rem']}>
          <DataStack
            className="pressure-data"
            title="Pressure"
            value={`${Math.round(pressure)} mb`}
            loading={loading}
          />
          <DataStack
            className="humidity-data"
            title="Humidity"
            value={`${Math.round(humidity)}%`}
            loading={loading}
          />
          <DataStack
            className="clouds-data"
            title="Clouds"
            value={`${Math.round(clouds ?? 0)}%`}
            loading={loading}
          />
        </HStack>
      </VStack>
    </Center>
  );
}

export default WeatherHeader;
