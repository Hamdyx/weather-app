import { useSelector } from 'react-redux';
import { HStack, Box, Skeleton } from '@chakra-ui/react';

import { RootState } from 'app/store';

import HourlyItem from './components/HourlyItem';

function HourlySlider() {
  const allHoursData = useSelector((state: RootState) => state.weather.hourly);

  const hourlyArr = [];
  for (const [k, v] of Object.entries(allHoursData)) {
    if (+k < 1) {
      // skip first hour as it's the current hour
      continue;
    }
    if (+k > 5) {
      // get only 5 items
      break;
    }
    // add the hour forecast data to the array
    hourlyArr.push(v);
  }

  const hourlyItems = hourlyArr.map((el) => {
    return <HourlyItem key={el.dt} data={el} />;
  });

  return (
    <Skeleton height="101px" isLoaded={hourlyArr.length > 0} fadeDuration={1}>
      <Box layerStyle="hourly">
        <HStack
          spacing="8px"
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
