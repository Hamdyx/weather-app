'use client';

import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Box as="main" display="flex" flex={1} justifyContent="center" p={8}>
      <VStack gap={4}>
        <Heading as="h2" size="lg">
          Something went wrong.
        </Heading>
        <Text>We hit an unexpected error loading the weather app.</Text>
        <Button onClick={() => reset()}>Try again</Button>
      </VStack>
    </Box>
  );
}

export default ErrorPage;
