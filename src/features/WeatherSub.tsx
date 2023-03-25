import { useSelector } from 'react-redux';
import {
  VStack,
  HStack,
  Drawer,
  DrawerBody,
  Text,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Button,
  useDisclosure,
  Spacer,
} from '@chakra-ui/react';

import { formatUnixTime } from '../util/util';
import { RootState } from 'app/store';

function WeatherSub() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const todayData = useSelector((state: RootState) => state.weather.daily[0]);
  let content;

  if (todayData) {
    const { sunrise, sunset, moonrise, moonset, uvi, moon_phase } = todayData;
    content = (
      <DrawerBody>
        <HStack>
          <DataStack
            className="sunrise-data"
            title={'Sunrise'}
            value={formatUnixTime(sunrise)}
          />
          <Spacer />

          <DataStack
            className="sunset-data"
            title={'Sunset'}
            value={formatUnixTime(sunset)}
          />
        </HStack>

        <HStack mt={2}>
          <DataStack
            className="moonrise-data"
            title={'Moonrise'}
            value={formatUnixTime(moonrise)}
          />
          <Spacer />
          <DataStack
            className="moonset-data"
            title={'Moonset'}
            value={formatUnixTime(moonset)}
          />
        </HStack>

        <HStack mt={2}>
          <DataStack
            className="moonphase-data"
            title={'Moon Phase'}
            value={moon_phase}
          />
          <Spacer />
          <DataStack className="uv-data" title={'UV Index'} value={uvi} />
        </HStack>
      </DrawerBody>
    );
  } else {
    content = <DrawerBody>Loading</DrawerBody>;
  }

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen} m="auto 0">
        Details
      </Button>
      <Drawer onClose={onClose} isOpen={isOpen} size={'xs'}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Day Details</DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default WeatherSub;

function DataStack({ className, value, title }: any) {
  return (
    <VStack>
      <Text fontSize="md">{title}</Text>
      <Text fontSize="md" className={className}>
        {value}
      </Text>
    </VStack>
  );
}
