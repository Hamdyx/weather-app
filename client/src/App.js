import { ChakraProvider, Box, HStack, Spacer } from '@chakra-ui/react';
import theme from './theme';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import WeatherMain from './features/WeatherMain';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl" h="100%" className="main-content">
        <HStack spacing={6} p={4} h={50}>
          <Spacer />

          <ColorModeSwitcher justifySelf="flex-end" />
        </HStack>
        <WeatherMain />
      </Box>
    </ChakraProvider>
  );
}

export default App;
