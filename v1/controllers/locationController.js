const fs = require('fs');
const express = require('express');
const axios = require('axios');

const locations = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/locations.json`)
);

const apiKey = process.env.API_KEY;

/* 
    TODO:   1. create getters for coordinates by name
            2. create util functions to format text data
            3. figure out better data structure
 */
// ############# GET api/v1/locations
exports.fetchLocations = async (req, res) => {
  console.log('fetchLocations');
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: locations.length,
    locations,
  });
};

// ############# GET api/v1/locations/search/str
exports.getFilteredLocations = async (req, res) => {
  const { str } = req.params;
  const re = new RegExp(`^(${str})[a-z0-9_-]*$`, 'i');
  const filteredLocations = locations.filter(l => {
    let city = l.name;
    return city?.match(re) ? true : false;
  });
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: filteredLocations.length,
    filteredLocations,
  });
};

// ############# GET api/v1/locations/:name
// fetch locations from openweather api
// save data to json file
exports.fetchCoordinatesByName = async (req, res) => {
  const { name } = req.params;
  const data = await handleDataFetch(name);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: data.length,
    data,
  });
};

async function handleDataFetch(name) {
  const endpoint = 'http://api.openweathermap.org/geo/1.0/direct?';
  const results = await axios.get(
    `${endpoint}q=${name}&limit=${10}&appid=${apiKey}`
  );
  let data = results.data;

  data = data.map(el => {
    const { lat, lon } = el;
    return { ...el, id: `${lat}-${lon}` };
  });

  // if there is no saved location with the data lat-lon
  //    add the unique location to hte array and save it to locations.json
  data.forEach(el => {
    let index = locations.findIndex(location => location.id === el.id);
    if (index === -1) {
      locations.push(el);
    }
  });

  console.table(data);
  fs.writeFile(
    `${__dirname}/../dev-data/locations.json`,
    JSON.stringify(locations, null, 4),
    err => {
      if (err) {
        console.log(err);
        return -1;
      }
    }
  );
  return data;
}
