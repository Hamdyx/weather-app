import { useSelector } from 'react-redux';

import { HStack, Box, Grid, GridItem, Image } from '@chakra-ui/react';

import { formatUnixDay } from '../util/util';

function DailyForecast() {
  const dailyItems = useSelector(state => state.weather.daily);
  let content = [];

  for (const [k, v] of Object.entries(dailyItems)) {
    content.push(v);
  }

  content = content.map((item, i) => {
    return <DayItem key={i} item={item} />;
  });

  return (
    <Box layerStyle="hourly" className="days-forecast" p={4}>
      {content}
    </Box>
  );
}

const DayItem = ({ item }) => {
  const {
    dt,
    weather, // [{id, main, description, icon}]
    temp, // {day, min, max, night, eve, morn}
  } = item;
  // item = { dt, sunrise, sunset, moonrise, moonset, moon_phase, temp, feels_like
  //          pressure, dew_point, wind_speed, wind_deg, weather, clouds, uvi }
  const icon = `icons/${weather[0].icon}.png`;
  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={6}>
      <GridItem w="100%" colSpan={3}>
        <p flex={1} align="left">
          {formatUnixDay(dt)}
        </p>
      </GridItem>

      <GridItem w="100%" colSpan={9}>
        <HStack>
          <Image src={icon} alt={`${weather[0].description}`} margin={0} />
          <p className="today-status">{weather[0].description}</p>

          <p className="day-forecast" align="right" ml="auto">{`${Math.round(
            temp.max
          )} / ${Math.round(temp.min)}\u00b0`}</p>
        </HStack>
      </GridItem>
    </Grid>
  );
};

export default DailyForecast;
