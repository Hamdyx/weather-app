'use client';

import { HStack, Spacer } from '@chakra-ui/react';

import { useAppSelector } from '@/store';
import { formatCityTime } from '@/util/format';

import { selectTimezoneOffsetSeconds } from '../weatherSlice';
import DataStack from './DataStack';

function WeatherDrawerContent() {
  const location = useAppSelector((state) => state.weather.location);
  const currentStatus = useAppSelector((state) => state.weather.currentStatus);
  const utcOffsetSeconds = useAppSelector(selectTimezoneOffsetSeconds) ?? 0;

  const loading = currentStatus === 'idle' || currentStatus === 'loading';
  const dataUnavailable = currentStatus === 'failed' || !location;

  const sunriseValue =
    !dataUnavailable && location
      ? formatCityTime(location.sunrise, utcOffsetSeconds, 'h:mm A')
      : '—';
  const sunsetValue =
    !dataUnavailable && location
      ? formatCityTime(location.sunset, utcOffsetSeconds, 'h:mm A')
      : '—';

  return (
    <HStack>
      <DataStack
        className="sunrise-data"
        title={'Sunrise'}
        value={sunriseValue}
        loading={loading}
      />
      <Spacer />

      <DataStack
        className="sunset-data"
        title={'Sunset'}
        value={sunsetValue}
        loading={loading}
      />
    </HStack>
  );
}

export default WeatherDrawerContent;
