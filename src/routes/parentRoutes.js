const express = require('express'),
  router = express.Router(),
  parents = require('../controllers/parentController');

router.get('/', parents.findAll).put('/:id', parents.update);

module.exports = router;
