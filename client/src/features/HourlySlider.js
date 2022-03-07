import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHourlyWeather } from './weatherSlice';

import { Text, HStack, Box } from '@chakra-ui/react';
import { formatUnixTime } from '../util/util';

function HourlySlider() {
  const dispatch = useDispatch();
  const allHoursData = useSelector(state => state.weather.hourly);

  useEffect(() => {
    dispatch(fetchHourlyWeather());
  }, [dispatch]);

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
