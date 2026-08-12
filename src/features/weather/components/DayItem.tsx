'use client';

import type { DailyForecastDay } from '../forecast';

import { HStack, Grid, GridItem, Image, Text } from '@chakra-ui/react';

import { formatDayLabel } from '@/util/format';

import { weatherIconPath } from '../icons';

interface Props {
  item: DailyForecastDay;
  utcOffsetSeconds: number;
}

function DayItem({ item, utcOffsetSeconds }: Props) {
  const { dt, weather, temp } = item;

  const icon = weatherIconPath(weather?.[0]?.icon);
  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={6}>
      <GridItem w="100%" colSpan={3}>
        <Text>{formatDayLabel(dt, utcOffsetSeconds)}</Text>
      </GridItem>

      <GridItem w="100%" colSpan={9}>
        <HStack>
          <Image
            src={icon}
            alt={weather?.[0]?.description ?? ''}
            margin={0}
            width="48px"
            height="48px"
            htmlWidth={48}
            htmlHeight={48}
            loading="lazy"
          />
          <Text>{weather?.[0]?.description}</Text>

          <Text marginLeft="auto">{`${Math.round(temp.max)} / ${Math.round(
            temp.min,
          )}\u00b0`}</Text>
        </HStack>
      </GridItem>
    </Grid>
  );
}

export default DayItem;
