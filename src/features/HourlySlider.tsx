import { useSelector } from 'react-redux';
import { HStack, Box, Skeleton } from '@chakra-ui/react';

import { RootState } from '@/app/store';

import HourlyItem from './components/HourlyItem';

function HourlySlider() {
  const allHoursData = useSelector((state: RootState) => state.weather.hourly);

  const hourlyItems = allHoursData.slice(0, 5).map((el) => {
    return <HourlyItem key={el.dt} data={el} />;
  });

  return (
    <Skeleton height="101px" loading={allHoursData.length === 0}>
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
