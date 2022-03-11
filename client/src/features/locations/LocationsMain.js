import React, { StrictMode, useState } from 'react';

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  VStack,
  HStack,
  Input,
  Center,
  Heading,
} from '@chakra-ui/react';

function Locations() {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');

  const onLocationChange = e => {
    e.preventDefault();
    console.log(e.currentTarget);
    console.log(e.currentTarget.value);
    console.log(e.currentTarget.id);
  };

  return (
    <StrictMode>
      <Center p={4}>
        <VStack>
          <Heading>Locations Page</Heading>
          <HStack pt={8}>
            <LocationInput
              label="city"
              type="text"
              changeFn={onLocationChange}
            />

            <LocationInput
              label="state"
              type="text"
              changeFn={onLocationChange}
            />
          </HStack>
          <HStack>
            <LocationInput
              label="latitude"
              type="number"
              changeFn={onLocationChange}
            />

            <LocationInput
              label="longitude"
              type="number"
              changeFn={onLocationChange}
            />
          </HStack>
        </VStack>
      </Center>
    </StrictMode>
  );
}

const LocationInput = ({ label, type, changeFn }) => {
  return (
    <FormControl>
      <FormLabel htmlFor={label}>{label}</FormLabel>
      <Input id={label} type={type} onChange={changeFn} />
    </FormControl>
  );
};

export default Locations;
