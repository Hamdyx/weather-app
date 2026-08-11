'use client';

import type { DailyForecastItem } from '../types';

import { HStack, Grid, GridItem, Image, Text } from '@chakra-ui/react';

import { formatUnixDay } from '@/util/format';

import { weatherIconPath } from '../icons';

interface Props {
  item: DailyForecastItem;
}

function DayItem({ item }: Props) {
  const { dt, weather, temp } = item;

  const icon = weatherIconPath(weather[0].icon);
  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={6}>
      <GridItem w="100%" colSpan={3}>
        <Text>{formatUnixDay(dt)}</Text>
      </GridItem>

      <GridItem w="100%" colSpan={9}>
        <HStack>
          <Image src={icon} alt={weather[0].description} margin={0} />
          <Text>{weather[0].description}</Text>

          <Text marginLeft="auto">{`${Math.round(temp.max)} / ${Math.round(
            temp.min,
          )}\u00b0`}</Text>
        </HStack>
      </GridItem>
    </Grid>
  );
}

export default DayItem;
