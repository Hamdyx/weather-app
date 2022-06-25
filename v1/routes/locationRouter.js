const express = require('express');

const {
  fetchLocations,
  fetchCoordinatesByName,
  getFilteredLocations,
} = require('../controllers/locationController');

const router = express.Router();

// fetch all locations saved locally
router.route('/').get(fetchLocations);
// fetch locations by name
router.route('/:name').get(fetchCoordinatesByName);
router.route('/search/:str').get(getFilteredLocations);

module.exports = router;
