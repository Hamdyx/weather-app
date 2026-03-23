import { HStack, Spacer } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

import { RootState } from '@/app/store';

import DataStack from './DataStack';

function WeatherDrawerContent() {
  const { location, loading } = useSelector(
    (state: RootState) => state.weather,
  );

  const { sunrise = 0, sunset = 0 } = location || {};

  return (
    <HStack>
      <DataStack
        className="sunrise-data"
        title={'Sunrise'}
        value={dayjs.unix(sunrise).format('h:mm A')}
        loading={loading}
      />
      <Spacer />

      <DataStack
        className="sunset-data"
        title={'Sunset'}
        value={dayjs.unix(sunset).format('h:mm A')}
        loading={loading}
      />
    </HStack>
  );
}

export default WeatherDrawerContent;
