'use client';

import type { ForecastWeather } from '../types';

import { Text, Box, Image } from '@chakra-ui/react';

import { formatCityTime } from '@/util/format';

import { weatherIconPath } from '../icons';

interface Props {
  data: ForecastWeather;
  utcOffsetSeconds: number;
}

function HourlyItem({ data, utcOffsetSeconds }: Props) {
  const { dt, main, weather } = data;
  const cloudIcon = weatherIconPath(weather?.[0]?.icon);

  return (
    <Box flex={1} h="75%">
      <Text className="hourly-time" fontSize=".75rem">
        {formatCityTime(dt, utcOffsetSeconds, 'h A')}
      </Text>
      <Image
        src={cloudIcon}
        alt={weather?.[0]?.description ?? ''}
        width={50}
        height={50}
        className="hourly-icon"
      />
      <Text className="hourly-data" mt="-.5rem">{`${Math.round(
        main.temp,
      )}\u00b0`}</Text>
    </Box>
  );
}

export default HourlyItem;
