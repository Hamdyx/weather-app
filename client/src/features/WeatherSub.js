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

const axios = require('axios');
function WeatherSub() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchDailyData = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/v1/weather/daily/');
    const todayData = res.data.data[0];

    updateUIFields(todayData);
  };
  fetchDailyData();

  const updateUIFields = info => {
    if (Object.keys(info) === 0) return;
    const { sunrise, sunset, moonrise, moonset, uvi, moon_phase } = info; // { sunrise, sunset, moonrise, moonset, pressure, uvi,
    // wind_speed, moon_phase, dew_point }

    if (isOpen) {
      document.querySelector('.sunrise-data').textContent = `${formatUnixTime(
        sunrise
      )}`;
      document.querySelector('.sunset-data').textContent = `${formatUnixTime(
        sunset
      )}`;

      document.querySelector('.moonrise-data').textContent = `${formatUnixTime(
        moonrise
      )}`;
      document.querySelector('.moonset-data').textContent = `${formatUnixTime(
        moonset
      )}`;

      document.querySelector('.moonphase-data').textContent = `${moon_phase}`;

      document.querySelector('.uv-data').textContent = `${uvi}`;
    }
  };

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen} m="auto 0">
        Details
      </Button>
      <Drawer onClose={onClose} isOpen={isOpen} size={'xs'}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Day Details</DrawerHeader>
          <DrawerBody>
            <HStack>
              <DataStack
                className="sunrise-data"
                title={'Sunrise'}
                value={1646022157}
              />
              <Spacer />

              <DataStack
                className="sunset-data"
                title={'Sunset'}
                value={1646063581}
              />
            </HStack>

            <HStack mt={2}>
              <DataStack
                className="moonrise-data"
                title={'Moonrise'}
                value={1646017020}
              />
              <Spacer />
              <DataStack
                className="moonset-data"
                title={'Moonset'}
                value={1646054880}
              />
            </HStack>

            <HStack mt={2}>
              <DataStack
                className="moonphase-data"
                title={'Moon Phase'}
                value={0.53}
              />
              <Spacer />
              <DataStack className="uv-data" title={'UV Index'} value={2.13} />
            </HStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default WeatherSub;

function DataStack({ className, value, title }) {
  return (
    <VStack>
      <Text fontSize="md">{title}</Text>
      <Text fontSize="md" className={className}>
        {value}
      </Text>
    </VStack>
  );
}
