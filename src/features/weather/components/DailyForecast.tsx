'use client';

import { Box, Skeleton, Text } from '@chakra-ui/react';

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
  const failed = forecastStatus === 'failed';

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
        {failed ? <Text>Forecast unavailable — try refresh</Text> : content}
      </Box>
    </Skeleton>
  );
}

export default DailyForecast;
