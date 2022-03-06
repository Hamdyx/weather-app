const express = require('express');
const axios = require('axios');

const weather = {
  current: {},
  hourly: {},
  daily: {},
};

const apiKey = process.env.API_KEY;

const updateCurrentData = data => {
  weather.current = { ...data };
  return weather.current;
};
const updateHourlyData = data => {
  weather.hourly = { ...data };
  return weather.hourly;
};
const updateDailyData = data => {
  weather.daily = { ...data };
  return weather.daily;
};

exports.getWeatherByCoordinates = async () => {
  console.log('getWeatherByCoordinates');
};

exports.checkBody = async (req, res, next, val) => {
  console.log('checkId');
  next();
};

exports.checkID = async (req, res, next, val) => {
  console.log('checkId');
  next();
};
exports.fetchData = async (req, res) => {
  console.log('fetchData');
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: 'data.length',
    data: 'fetchData',
  });
};

exports.fetchWeather = async (req, res) => {
  /* 
    api.openweathermap.org/data/2.5/weather?
        lat={lat}&lon={lon}&appid=7caaf4b2229b74317596e057fe1cd827 */
  const [lat, lon] = req.params.coord.split('-');
  console.log(lat);
  console.log(lon);
  console.log('fetchWeather');
  const endpoint = 'http://api.openweathermap.org/data/2.5/weather?';
  const results = await axios.get(
    `${endpoint}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
  const data = results.data;
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: 'data.length',
    data: data,
  });
};

exports.fetchWeatherForecast = async (req, res) => {
  const [lat, lon] = req.params.coord.split('-');
  console.log(lat);
  console.log(lon);
  console.log('fetchWeatherForecast');
  const endpoint = 'https://api.openweathermap.org/data/2.5/onecall?';
  const results = await axios.get(
    `${endpoint}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
  const data = results.data;
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: 'data.length',
    data: data,
  });
};

const fetchWeatherData = async (lat, lon) => {
  // const [lat, lon] = req.params.coord.split('-');
  console.log(lat);
  console.log(lon);
  console.log('fetchWeatherData');
  const endpoint = 'https://api.openweathermap.org/data/2.5/onecall?';
  const results = await axios.get(
    `${endpoint}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
  const data = results.data;
  updateCurrentData(data.current);
  updateHourlyData(data.hourly);
  updateDailyData(data.daily);
  // weather.current = data.current;
  // weather.hourly = data.hourly;
  // weather.daily = data.daily;
  return weather;
};

fetchWeatherData('30.0443879', '31.2357257');

exports.getCurrentData = async (req, res) => {
  // const [lat, lon] = req.params.coord.split('-');
  // console.log(lat);
  // console.log(lon);
  console.log('getCurrentData');
  // const endpoint = 'https://api.openweathermap.org/data/2.5/onecall?';
  // const results = await axios.get(
  //   `${endpoint}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  // );
  // const data = results.data;
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: 'data.length',
    data: weather.current,
  });
};

exports.getDailyData = async (req, res) => {
  console.log('getDailyData');

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: 'data.length',
    data: weather.daily,
  });
};

exports.getHourlyData = async (req, res) => {
  console.log('getHourlyData');

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: weather.hourly.length,
    data: weather.hourly,
  });
};

exports.changeLocation = async (req, res) => {
  console.log('changeLocation');
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: 'data.length',
    data: 'changeLocation',
  });
};

exports.fetchCoordinates = async (req, res) => {
  const { name } = req.params;
  console.log(`name: ${name}`);
  console.log('fetchCoordinates');
  const endpoint = 'http://api.openweathermap.org/geo/1.0/direct?';
  const results = await axios.get(
    `${endpoint}q=${'cairo'}&limit=${5}&appid=${apiKey}`
  );
  const data = results.data;

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: data.length,
    data,
  });
};
