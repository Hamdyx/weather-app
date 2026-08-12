'use client';

import { HStack, Box, Skeleton, Text } from '@chakra-ui/react';

import { useAppSelector } from '@/store';

import {
  selectForecastStatus,
  selectHourlySlots,
  selectTimezoneOffsetSeconds,
} from '../weatherSlice';
import HourlyItem from './HourlyItem';

const SKELETON_HEIGHT = '101px';

function HourlySlider() {
  const hourlySlots = useAppSelector(selectHourlySlots);
  const forecastStatus = useAppSelector(selectForecastStatus);
  const utcOffsetSeconds = useAppSelector(selectTimezoneOffsetSeconds) ?? 0;

  const loading = forecastStatus === 'idle' || forecastStatus === 'loading';
  const failed = forecastStatus === 'failed';

  const hourlyItems = hourlySlots.map((el) => {
    return (
      <HourlyItem key={el.dt} data={el} utcOffsetSeconds={utcOffsetSeconds} />
    );
  });

  return (
    <Skeleton height={SKELETON_HEIGHT} loading={loading}>
      <Box layerStyle="hourly">
        <HStack gap="8px" justifyContent="center" p={1}>
          {failed ? (
            <Text>Forecast unavailable — try refresh</Text>
          ) : (
            hourlyItems
          )}
        </HStack>
      </Box>
    </Skeleton>
  );
}

export default HourlySlider;
