'use client';

import { Box } from '@chakra-ui/react';

import Navbar from './navbar';

export default function Layout({ children }) {
  return (
    <Box textAlign="center" fontSize="xl" h="100%" className="main-content">
      <Navbar />
      {children}
    </Box>
  );
}
