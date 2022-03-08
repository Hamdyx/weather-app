const express = require('express');

const {
  fetchLocations,
  fetchCoordinatesByName,
} = require('../controllers/locationCOntroller');

const router = express.Router();

// fetch all locations saved locally
router.route('/').get(fetchLocations);
// fetch locations by name
router.route('/:name').get(fetchCoordinatesByName);

module.exports = router;
