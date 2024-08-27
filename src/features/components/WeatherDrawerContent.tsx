import { useSelector } from 'react-redux';
import { HStack, DrawerBody, Spacer } from '@chakra-ui/react';

import { RootState } from 'app/store';
import { formatUnixTime } from 'util/util';

import DataStack from './DataStack';

function WeatherDrawerContent() {
  const { daily: todayData, loading } = useSelector(
    (state: RootState) => state.weather,
  );

  const {
    sunrise = 0,
    sunset = 0,
    moonrise = 0,
    moonset = 0,
    uvi = 0,
    moon_phase = 0,
  } = todayData?.[0] || {};

  return (
    <DrawerBody>
      <HStack>
        <DataStack
          className="sunrise-data"
          title={'Sunrise'}
          value={formatUnixTime(sunrise)}
          loading={loading}
        />
        <Spacer />

        <DataStack
          className="sunset-data"
          title={'Sunset'}
          value={formatUnixTime(sunset)}
          loading={loading}
        />
      </HStack>

      <HStack mt={2}>
        <DataStack
          className="moonrise-data"
          title={'Moonrise'}
          value={formatUnixTime(moonrise)}
          loading={loading}
        />
        <Spacer />
        <DataStack
          className="moonset-data"
          title={'Moonset'}
          value={formatUnixTime(moonset)}
          loading={loading}
        />
      </HStack>

      <HStack mt={2}>
        <DataStack
          className="moonphase-data"
          title={'Moon Phase'}
          value={moon_phase}
          loading={loading}
        />
        <Spacer />
        <DataStack
          className="uv-data"
          title={'UV Index'}
          value={uvi}
          loading={loading}
        />
      </HStack>
    </DrawerBody>
  );
}

export default WeatherDrawerContent;
