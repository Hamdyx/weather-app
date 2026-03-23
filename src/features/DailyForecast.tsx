import { Box, Skeleton } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

import { RootState } from '@/app/store';

import DayItem from './DayItem';

function DailyForecast() {
  const dailyItems = useSelector((state: RootState) => state.weather.daily);

  const content = dailyItems.map((item) => {
    return <DayItem key={item.dt} item={item} />;
  });

  return (
    <Skeleton height="420px" loading={content.length === 0}>
      <Box layerStyle="hourly" className="days-forecast" p={4}>
        {content}
      </Box>
    </Skeleton>
  );
}

export default DailyForecast;
