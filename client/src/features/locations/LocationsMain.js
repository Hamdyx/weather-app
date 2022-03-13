import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import {
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Input,
  Center,
  Heading,
  Box,
} from '@chakra-ui/react';

const axios = require('axios');

function Locations() {
  const searchCity = async value => {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/v1/locations/search/${value}`
    );
    console.table(res.data.filteredLocations);
    if (res.data.filteredLocations) {
      const citiesList = res.data.filteredLocations.map((city, i) => {
        return <LocationItem key={i} city={city} />;
      });

      console.log(citiesList);

      ReactDOM.render(citiesList, document.querySelector('#location-list'));
    } else {
      ReactDOM.render('', document.querySelector('#location-list'));
    }
  };

  const onLocationChange = e => {
    e.preventDefault();
    let value = e.currentTarget.value;

    switch (e.currentTarget.id) {
      case 'city':
        searchCity(value);
        break;
      case 'state':
        console.log('searchState()');
        break;
      default:
        console.log('invalid search');
    }
  };

  return (
    <StrictMode>
      <Box w="100%" p={4}>
        <HStack>
          <Heading as="h3" size="md">
            Managed cities
          </Heading>
        </HStack>
        <VStack mt={4} spacing={4}>
          <ManagedCity cityId={1} />
          <ManagedCity cityId={2} />
        </VStack>
      </Box>
      <Center p={4}>
        <VStack>
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
          <ul id="location-list"></ul>
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

const ManagedCity = ({ cityId }) => {
  return (
    <Box bg="gray" w="100%" p={4} color="white">
      Managed city {cityId}
    </Box>
  );
};

const LocationItem = ({ city }) => {
  const { name, lat, lon, country, state, id } = city;

  return <li>{`${name}, ${country} - ${state}`}</li>;
};

export default Locations;
