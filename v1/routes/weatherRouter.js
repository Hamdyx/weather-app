const express = require('express');

const {
  fetchData,
  checkBody,
  changeLocation,
  fetchCoordinates,
  getCurrentData,
  getDailyData,
  getHourlyData,
  fetchWeather,
  fetchWeatherForecast,
} = require('../controllers/weatherController');

const router = express.Router();

// router.param('id', checkId);

router.route('/').get(fetchData).post(checkBody, changeLocation);
router.route('/coordinates/:name').get(fetchCoordinates);
router.route('/current').get(getCurrentData);
router.route('/daily').get(getDailyData);
router.route('/hourly').get(getHourlyData);
router.route('/current/:coord').get(fetchWeather);
router.route('/oneCall/:coord').get(fetchWeatherForecast);

module.exports = router;
