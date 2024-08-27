import {
  Drawer,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Button,
  useDisclosure,
} from '@chakra-ui/react';

import WeatherDrawerContent from './components/WeatherDrawerContent';

function WeatherSub() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen} m="auto 0">
        Details
      </Button>
      <Drawer onClose={onClose} isOpen={isOpen} size={'xs'}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Day Details</DrawerHeader>
          <WeatherDrawerContent />
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default WeatherSub;
