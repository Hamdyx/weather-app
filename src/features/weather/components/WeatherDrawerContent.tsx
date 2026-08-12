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
  const { sunrise = 0, sunset = 0 } = location || {};

  return (
    <HStack>
      <DataStack
        className="sunrise-data"
        title={'Sunrise'}
        value={formatCityTime(sunrise, utcOffsetSeconds, 'h:mm A')}
        loading={loading}
      />
      <Spacer />

      <DataStack
        className="sunset-data"
        title={'Sunset'}
        value={formatCityTime(sunset, utcOffsetSeconds, 'h:mm A')}
        loading={loading}
      />
    </HStack>
  );
}

export default WeatherDrawerContent;
