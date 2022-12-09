import Navbar from './navbar';
import { Provider } from 'react-redux';
import { store } from '../app/store';

import { ChakraProvider, Box } from '@chakra-ui/react';
import theme from '../theme';

export default function Layout({ children }) {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl" h="100%" className="main-content">
        <Navbar />
        <Provider store={store}>{children}</Provider>
      </Box>
    </ChakraProvider>
  );
}
