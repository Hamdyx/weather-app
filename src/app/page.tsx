import type { Metadata } from 'next';

import { Box } from '@chakra-ui/react';

import WeatherMain from '@/features/weather/components/WeatherMain';

export const metadata: Metadata = {
  title: 'Weather App',
  description:
    'View current weather conditions and the daily and hourly forecast.',
};

function HomePage() {
  return (
    <Box as="main" display="flex" flex={1}>
      <WeatherMain />
    </Box>
  );
}

export default HomePage;
