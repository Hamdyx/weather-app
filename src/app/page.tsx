import type { Metadata } from 'next';

import { Box } from '@chakra-ui/react';

import WeatherMain from '@/features/weather/components/WeatherMain';

export const metadata: Metadata = {
  title: 'Weather App',
  description: 'Web site created with Next.js.',
};

function HomePage() {
  return (
    <Box as="main" display="flex" flex={1}>
      <WeatherMain />
    </Box>
  );
}

export default HomePage;
