'use client';

import { HStack, Box, Skeleton } from '@chakra-ui/react';

import { useAppSelector } from '@/store';

import {
  selectForecastStatus,
  selectHourlySlots,
  selectTimezoneOffsetSeconds,
} from '../weatherSlice';
import HourlyItem from './HourlyItem';

function HourlySlider() {
  const hourlySlots = useAppSelector(selectHourlySlots);
  const forecastStatus = useAppSelector(selectForecastStatus);
  const utcOffsetSeconds = useAppSelector(selectTimezoneOffsetSeconds) ?? 0;

  const loading = forecastStatus === 'idle' || forecastStatus === 'loading';

  const hourlyItems = hourlySlots.map((el) => {
    return (
      <HourlyItem key={el.dt} data={el} utcOffsetSeconds={utcOffsetSeconds} />
    );
  });

  return (
    <Skeleton height="101px" loading={loading}>
      <Box layerStyle="hourly">
        <HStack
          gap="8px"
          justifyContent="center"
          className="hourly-slider"
          p={1}
        >
          {hourlyItems}
        </HStack>
      </Box>
    </Skeleton>
  );
}

export default HourlySlider;
