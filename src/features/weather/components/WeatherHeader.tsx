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
import { useEffect, useRef } from 'react';

import { toaster } from '@/components/ui/toaster';
import { useAppDispatch, useAppSelector } from '@/store';
import { formatMpsToKmh, formatMtoKm } from '@/util/format';

import { weatherIconPath } from '../icons';
import { fetchActiveWeather, fetchForecast } from '../weatherSlice';
import DataStack from './DataStack';

const PLACEHOLDER = '—';

function WeatherHeader() {
  const main = useAppSelector((state) => state.weather.main);
  const weather = useAppSelector((state) => state.weather.weather);
  const visibility = useAppSelector((state) => state.weather.visibility);
  const wind = useAppSelector((state) => state.weather.wind);
  const clouds = useAppSelector((state) => state.weather.clouds);
  const activeLocation = useAppSelector(
    (state) => state.weather.activeLocation,
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

  const dataUnavailable = currentStatus === 'failed' || !main;
  const windUnavailable = currentStatus === 'failed' || !wind;

  const tempValue =
    !dataUnavailable && main ? `${Math.round(main.temp)}°` : PLACEHOLDER;
  const feelsLikeValue =
    !dataUnavailable && main ? `${Math.round(main.feels_like)}°` : PLACEHOLDER;
  const pressureValue =
    !dataUnavailable && main ? `${Math.round(main.pressure)} mb` : PLACEHOLDER;
  const humidityValue =
    !dataUnavailable && main ? `${Math.round(main.humidity)}%` : PLACEHOLDER;
  const windValue =
    !windUnavailable && wind
      ? `${formatMpsToKmh(wind.speed)} km/h`
      : PLACEHOLDER;
  const visibilityValue =
    !dataUnavailable && visibility !== null
      ? `${formatMtoKm(visibility)} km`
      : PLACEHOLDER;
  const cloudsValue = !dataUnavailable
    ? `${Math.round(clouds ?? 0)}%`
    : PLACEHOLDER;

  const cloudIcon = weatherIconPath(weather?.[0]?.icon);

  const prevCurrentStatusRef = useRef(currentStatus);
  useEffect(() => {
    const prevStatus = prevCurrentStatusRef.current;
    prevCurrentStatusRef.current = currentStatus;

    if (prevStatus !== 'failed' && currentStatus === 'failed') {
      toaster.error({
        title: 'Error Updating Weather.',
        description: currentError,
        duration: 5000,
      });
    }
  }, [currentStatus, currentError]);

  const prevForecastStatusRef = useRef(forecastStatus);
  useEffect(() => {
    const prevStatus = prevForecastStatusRef.current;
    prevForecastStatusRef.current = forecastStatus;

    if (prevStatus !== 'failed' && forecastStatus === 'failed') {
      toaster.error({
        title: 'Error Updating Weather.',
        description: forecastError,
        duration: 5000,
      });
    }
  }, [forecastStatus, forecastError]);

  const updateWeather = () => {
    const { lat, lon } = activeLocation;

    // Failures are surfaced by the status effects above; only an
    // all-fulfilled refresh earns a success toast.
    void Promise.allSettled([
      dispatch(fetchActiveWeather({ lat, lon })).unwrap(),
      dispatch(fetchForecast({ lat, lon })).unwrap(),
    ]).then((results) => {
      if (results.every((result) => result.status === 'fulfilled')) {
        toaster.success({
          title: 'Weather Updated.',
          duration: 3000,
        });
      }
    });
  };

  return (
    <Center p={4}>
      <VStack gap="1rem">
        <HStack gap={4}>
          <Heading as="h1" size="lg">
            {activeLocation.name}
          </Heading>
          <Button
            onClick={updateWeather}
            disabled={refreshing}
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
              htmlWidth={65}
              htmlHeight={65}
              className="curr-icon"
            />
          </Skeleton>
          <Skeleton loading={loading}>
            <Heading as="h2" size="4xl" className="curr-temp">
              {tempValue}
            </Heading>
          </Skeleton>
        </HStack>
        <Spacer />
        <HStack gap={['1rem', '2rem']}>
          <DataStack
            className="feels-like-data"
            title="Feels like"
            value={feelsLikeValue}
            loading={loading}
          />
          <DataStack
            className="wind-data"
            title="Wind"
            value={windValue}
            loading={loading}
          />
          <DataStack
            className="visibility-data"
            title="Visibility"
            value={visibilityValue}
            loading={loading}
          />
        </HStack>
        <Spacer />
        <HStack gap={['.75rem', '2rem']}>
          <DataStack
            className="pressure-data"
            title="Pressure"
            value={pressureValue}
            loading={loading}
          />
          <DataStack
            className="humidity-data"
            title="Humidity"
            value={humidityValue}
            loading={loading}
          />
          <DataStack
            className="clouds-data"
            title="Clouds"
            value={cloudsValue}
            loading={loading}
          />
        </HStack>
      </VStack>
    </Center>
  );
}

export default WeatherHeader;
