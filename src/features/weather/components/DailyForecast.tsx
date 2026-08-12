'use client';

import { Box, Skeleton } from '@chakra-ui/react';

import { useAppSelector } from '@/store';

import {
  selectDailyForecast,
  selectForecastStatus,
  selectTimezoneOffsetSeconds,
} from '../weatherSlice';
import DayItem from './DayItem';

function DailyForecast() {
  const dailyItems = useAppSelector(selectDailyForecast);
  const forecastStatus = useAppSelector(selectForecastStatus);
  const utcOffsetSeconds = useAppSelector(selectTimezoneOffsetSeconds) ?? 0;

  const loading = forecastStatus === 'idle' || forecastStatus === 'loading';

  const content = dailyItems.map((item) => {
    return (
      <DayItem
        key={item.dateKey}
        item={item}
        utcOffsetSeconds={utcOffsetSeconds}
      />
    );
  });

  return (
    <Skeleton height="420px" loading={loading}>
      <Box layerStyle="hourly" className="days-forecast" p={4}>
        {content}
      </Box>
    </Skeleton>
  );
}

export default DailyForecast;
