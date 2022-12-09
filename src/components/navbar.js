// import Link from 'next/link';
import { HStack, Spacer } from '@chakra-ui/react';

import { ColorModeSwitcher } from '../ColorModeSwitcher';

export default function Navbar() {
  return (
    <HStack spacing={6} p={4} h={50}>
      {/* <Link href="/">
        <a href="/">Home</a>
      </Link> */}
      {/* <Link href="/locations">
        <a href="/locations">locations</a>
      </Link> */}
      <Spacer />

      <ColorModeSwitcher justifySelf="flex-end" />
    </HStack>
  );
}
