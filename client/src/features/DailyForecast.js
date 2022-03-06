import ReactDOM from 'react-dom';
import { HStack, Box, Grid, GridItem, Image } from '@chakra-ui/react';

import { formatUnixDay } from '../util/util';

const axios = require('axios');

function DailyForecast() {
  let daysData = '';
  let content = [];

  const updateUIFields = data => {
    if (Object.keys(data) === 0) {
      console.log('DailyDrawer data is empty');
      return;
    }

    console.log('DailyDrawer updateUIFields');
    console.log(new Date().toISOString());
    console.log(data);

    for (const [k, v] of Object.entries(data)) {
      content.push(v);
    }
    console.log(content);

    content = content.map((item, i) => {
      const {
        dt,
        temp, // {day, min, max, night, eve, morn}
        weather, // [{id, main, description, icon}]
      } = item;
      // item = { dt, sunrise, sunset, moonrise, moonset, moon_phase, temp, feels_like
      //          pressure, dew_point, wind_speed, wind_deg, weather, clouds, uvi }
      // temp = {day, min, max, night, eve, morn}
      // feels_like = {day, night, eve, morn}

      const cloudIcon = `icons/${weather[0].icon}.png`;

      return (
        <DayItem
          key={dt}
          unixDate={dt}
          weather={weather}
          temp={temp}
          icon={cloudIcon}
        />
      );
    });

    ReactDOM.render(content, document.querySelector('.days-forecast'));
  };

  const fetchDailyData = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/v1/weather/daily/');
    daysData = res.data.data;

    updateUIFields(daysData);
  };
  fetchDailyData();

  return (
    <Box layerStyle="hourly" className="days-forecast" p={4}>
      {content}
    </Box>
  );
}

const DayItem = ({ unixDate, weather, temp, icon }) => {
  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={6}>
      <GridItem w="100%" colSpan={3}>
        <p flex={1} align="left">
          {formatUnixDay(unixDate)}
        </p>
      </GridItem>

      <GridItem w="100%" colSpan={9}>
        <HStack>
          <Image src={icon} alt={`${weather[0].description}`} margin={0} />
          <p className="today-status">{weather[0].description}</p>

          <p className="day-forecast" align="right" ml="auto">{`${Math.round(
            temp.max
          )} / ${Math.round(temp.min)}\u00b0`}</p>
        </HStack>
      </GridItem>
    </Grid>
  );
};

export default DailyForecast;
