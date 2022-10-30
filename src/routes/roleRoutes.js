const express = require('express'),
  router = express.Router(),
  roles = require('../controllers/roleController');

router.get('/', roles.findAll);

module.exports = router;
