import React from 'react';
import ReactDOM from 'react-dom';

import {
  Heading,
  Text,
  VStack,
  HStack,
  Box,
  Spacer,
  Image,
} from '@chakra-ui/react';
import { formatUnixTime } from '../util/util';

const axios = require('axios');

function HourlySlider() {
  let content;
  const fetchHourlyData = async () => {
    // console.log('HourlySlider fetchHourlyData');
    const res = await axios.get('http://127.0.0.1:8000/api/v1/weather/hourly/');
    const hourlyArr = res.data.data;

    updateUIFields(hourlyArr);
  };
  fetchHourlyData();

  const updateUIFields = info => {
    if (Object.keys(info).length === 0) {
      console.log('hourly data is empty');
      return;
    }
    const contentArr = [];
    for (const [k, v] of Object.entries(info)) {
      // console.log(k);
      if (k < 1) {
        // console.log(`first element`);
        continue;
      }
      if (k > 5) {
        // console.log(`last element`);
        break;
      }
      // console.log(v);
      contentArr.push(v);
    }
    content = contentArr.map((el, i) => {
      const { dt, temp, weather } = el;
      // console.log(weather);
      const cloudIcon = `icons/${weather[0].icon}.png`;
      return (
        <Box key={i} flex={1} h="75%">
          <Text className="hourly-time" fontSize=".75rem">
            {formatUnixTime(dt)}
          </Text>
          <img
            src={cloudIcon}
            alt={`${weather[0].description}`}
            width={50}
            height={50}
            className="hourly-icon"
          />
          <Text className="hourly-data" mt="-.5rem">{`${Math.round(
            temp
          )}\u00b0`}</Text>
        </Box>
      );
    });
    ReactDOM.render(content, document.querySelector('.hourly-slider'));
  };

  React.useEffect(() => {
    // console.log('Hourlycontent changed');
  }, [content]);

  return (
    <Box layerStyle="hourly">
      <HStack
        spacing="8px"
        justifyContent="center"
        className="hourly-slider"
        p={1}
      ></HStack>
    </Box>
  );
}

export default HourlySlider;
