import { HStack, Spacer } from '@chakra-ui/react';

import { ColorModeButton } from './ui/color-mode';

export default function Navbar() {
  return (
    <HStack gap={6} p={4} h="navbarHeight">
      <Spacer />
      <ColorModeButton />
    </HStack>
  );
}
