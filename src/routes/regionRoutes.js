const express = require('express'),
  router = express.Router(),
  regions = require('../controllers/regionContriller');

router.get('/', regions.findAll);

module.exports = router;
