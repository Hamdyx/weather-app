import { Text, Box, Image } from '@chakra-ui/react';
import dayjs from 'dayjs';

import { ForecastWeather } from '@/features/types';

interface Props {
  data: ForecastWeather;
}

function HourlyItem({ data }: Props) {
  const { dt, main, weather } = data;
  const cloudIcon = `icons/${weather[0].icon}.png`;

  return (
    <Box flex={1} h="75%">
      <Text className="hourly-time" fontSize=".75rem">
        {dayjs.unix(dt).format('h A')}
      </Text>
      <Image
        src={cloudIcon}
        alt={`${weather[0].description}`}
        width={50}
        height={50}
        className="hourly-icon"
      />
      <Text className="hourly-data" mt="-.5rem">{`${Math.round(
        main.temp,
      )}\u00b0`}</Text>
    </Box>
  );
}

export default HourlyItem;
