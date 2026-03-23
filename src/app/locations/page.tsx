import type { Metadata } from 'next';

import { VStack, HStack, Center, Heading, Box } from '@chakra-ui/react';

import LocationInput from './components/LocationInput';

export const metadata: Metadata = {
  title: 'Locations',
  description: 'Web site created with Next.js.',
};

function Locations() {
  return (
    <main>
      <Box w="100%" p={4}>
        <HStack>
          <Heading as="h3" size="md">
            Managed cities
          </Heading>
        </HStack>
        <VStack mt={4} gap={4}>
          locationContent
        </VStack>
      </Box>
      <Center p={4}>
        <VStack>
          <HStack pt={8}>
            <LocationInput label="city" type="text" />
            <LocationInput label="state" type="text" />
          </HStack>
          <HStack>
            <LocationInput label="latitude" type="number" />
            <LocationInput label="longitude" type="number" />
          </HStack>
          <ul id="location-list"></ul>
        </VStack>
      </Center>
    </main>
  );
}

export default Locations;
