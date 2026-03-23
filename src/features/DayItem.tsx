import type { DailyForecastItem } from './types';

import { HStack, Grid, GridItem, Image } from '@chakra-ui/react';

import { formatUnixDay } from '../util/util';

interface Props {
  item: DailyForecastItem;
}

function DayItem({ item }: Props) {
  const { dt, weather, temp } = item;

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
            temp.min,
          )}\u00b0`}</p>
        </HStack>
      </GridItem>
    </Grid>
  );
}

export default DayItem;
