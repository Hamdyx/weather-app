import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  locationAdded,
  locationUpdated,
  fetchActiveWeather,
  selectLocationById,
  selectLocationsIds,
} from '../weatherSlice.js';

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
  const dispatch = useDispatch();
  const locationIds = useSelector(state => selectLocationsIds(state));
  console.log(locationIds);

  const handleLocationAdd = loc => {
    dispatch(locationAdded(loc));
  };
  const handleLocationUpdate = loc => {
    dispatch(locationUpdated(loc));
    dispatch(fetchActiveWeather(loc));
  };

  let locationContent = locationIds.map(el => (
    <ManagedCity key={el} cityId={el} updateFn={handleLocationUpdate} />
  ));

  const searchCity = async value => {
    if (value === '') {
      ReactDOM.render('', document.querySelector('#location-list'));
      return;
    }
    const res = await axios.get(
      `http://127.0.0.1:8000/api/v1/locations/search/${value}`
    );
    if (res.data.filteredLocations) {
      const citiesList = res.data.filteredLocations.map((city, i) => {
        return <LocationItem key={i} city={city} addFn={handleLocationAdd} />;
      });
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
          {locationContent}
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

const ManagedCity = ({ cityId, updateFn }) => {
  const city = useSelector(state => selectLocationById(state, cityId));
  const { name, lat, lon, country, state, id } = city;

  const handleClick = ev => {
    // update the activeLocation state with the clicked value
    updateFn(id);
  };

  return (
    <Box bg="gray" w="100%" p={4} color="white" onClick={handleClick}>
      {name}, {country} - {state}
    </Box>
  );
};

function LocationItem({ city, addFn }) {
  const { name, lat, lon, country, state, id } = city;
  const handleClick = e => {
    // Add the clicked locaiton to managed cities
    addFn(city);
  };

  return <li onClick={handleClick}>{`${name}, ${country} - ${state}`}</li>;
}

export default Locations;
