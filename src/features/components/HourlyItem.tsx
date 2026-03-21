import { Text, Box } from '@chakra-ui/react';

import { HourlyWeather } from '@/features/types';
import { formatUnixTime } from '@/util/util';

interface Props {
  data: HourlyWeather;
}

function HourlyItem({ data }: Props) {
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
        temp,
      )}\u00b0`}</Text>
    </Box>
  );
}

export default HourlyItem;
