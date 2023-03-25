import { HStack, Grid, GridItem, Image } from '@chakra-ui/react';
import { formatUnixDay } from '../util/util';

function DayItem({ item }: any) {
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
        <p>{formatUnixDay(dt)}</p>
      </GridItem>

      <GridItem w="100%" colSpan={9}>
        <HStack>
          <Image src={icon} alt={`${weather[0].description}`} margin={0} />
          <p className="today-status">{weather[0].description}</p>

          <p className="day-forecast">{`${Math.round(temp.max)} / ${Math.round(
            temp.min
          )}\u00b0`}</p>
        </HStack>
      </GridItem>
    </Grid>
  );
}

export default DayItem;
