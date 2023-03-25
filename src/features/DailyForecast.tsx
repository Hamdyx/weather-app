import { useSelector } from 'react-redux';
import { Box, Skeleton } from '@chakra-ui/react';
import { RootState } from 'app/store';
import DayItem from './DayItem';

function DailyForecast() {
  const dailyItems = useSelector((state: RootState) => state.weather.daily);
  let content = [];

  for (const v of Object.values(dailyItems)) {
    content.push(v);
  }

  content = content.map((item, i) => {
    return <DayItem key={i} item={item} />;
  });

  return (
    <Skeleton height="420px" isLoaded={content.length > 0} fadeDuration={2}>
      <Box layerStyle="hourly" className="days-forecast" p={4}>
        {content}
      </Box>
    </Skeleton>
  );
}

export default DailyForecast;
