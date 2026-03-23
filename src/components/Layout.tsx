'use client';

import { Box } from '@chakra-ui/react';

import Navbar from './Navbar';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <Box textAlign="center" fontSize="xl" h="100%" className="main-content">
      <Navbar />
      {children}
    </Box>
  );
}
