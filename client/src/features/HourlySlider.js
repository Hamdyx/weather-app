import { useSelector } from 'react-redux';

import { Text, HStack, Box, Skeleton } from '@chakra-ui/react';
import { formatUnixTime } from '../util/util';

function HourlySlider() {
  const allHoursData = useSelector(state => state.weather.hourly);

  let hourlyItems;

  const hourlyArr = [];
  for (const [k, v] of Object.entries(allHoursData)) {
    if (k < 1) {
      // skip first hour as it's the current hour
      continue;
    }
    if (k > 5) {
      // get only 5 items
      break;
    }
    // add the hour forecast data to the array
    hourlyArr.push(v);
  }

  hourlyItems = hourlyArr.map((el, i) => {
    return <HourlyItem key={i} data={el} />;
  });

  return (
    <Skeleton
      height='101px'
      isLoaded={hourlyArr.length > 0}
      fadeDuration={1}
    >
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

const HourlyItem = ({ data }) => {
  const { dt, temp, weather } = data;
  const cloudIcon = `icons/${weather[0].icon}.png`;
  return (
    <Box flex={1} h="75%">
      <Text className="hourly-time" fontSize=".75rem">
        {formatUnixTime(dt)}
      </Text>
      <img
        src={cloudIcon}
        alt={`${weather[0].description}`}
        width={50}
        height={50}
        className="hourly-icon"
      />
      <Text className="hourly-data" mt="-.5rem">{`${Math.round(
        temp
      )}\u00b0`}</Text>
    </Box>
  );
};

export default HourlySlider;
