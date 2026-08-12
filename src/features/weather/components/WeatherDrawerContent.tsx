'use client';

import { HStack, Spacer } from '@chakra-ui/react';

import { useAppSelector } from '@/store';
import { formatCityTime } from '@/util/format';

import { selectTimezoneOffsetSeconds } from '../weatherSlice';
import DataStack from './DataStack';

function WeatherDrawerContent() {
  const locationInfo = useAppSelector((state) => state.weather.locationInfo);
  const currentStatus = useAppSelector((state) => state.weather.currentStatus);
  const utcOffsetSeconds = useAppSelector(selectTimezoneOffsetSeconds) ?? 0;

  const loading = currentStatus === 'idle' || currentStatus === 'loading';
  const dataUnavailable = currentStatus === 'failed' || !locationInfo;

  const sunriseValue =
    !dataUnavailable && locationInfo
      ? formatCityTime(locationInfo.sunrise, utcOffsetSeconds, 'h:mm A')
      : '—';
  const sunsetValue =
    !dataUnavailable && locationInfo
      ? formatCityTime(locationInfo.sunset, utcOffsetSeconds, 'h:mm A')
      : '—';

  return (
    <HStack>
      <DataStack title={'Sunrise'} value={sunriseValue} loading={loading} />
      <Spacer />

      <DataStack title={'Sunset'} value={sunsetValue} loading={loading} />
    </HStack>
  );
}

export default WeatherDrawerContent;
