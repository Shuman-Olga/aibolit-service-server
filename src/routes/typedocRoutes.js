const express = require('express'),
  router = express.Router(),
  typedocs = require('../controllers/typedocController');

router.get('/', typedocs.findAll);

module.exports = router;
