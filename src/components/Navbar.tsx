import { HStack, Spacer } from '@chakra-ui/react';

import { ColorModeSwitcher } from './ColorModeSwitcher';

export default function Navbar() {
  return (
    <HStack spacing={6} p={4} h={50}>
      <Spacer />
      <ColorModeSwitcher />
    </HStack>
  );
}
