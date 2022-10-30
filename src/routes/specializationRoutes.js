const express = require('express'),
  router = express.Router(),
  specializations = require('../controllers/specializationController');

router
  .post('/', specializations.create)
  .get('/', specializations.findAll)
  .get('/published', specializations.findAllPublished)
  .get('/:id', specializations.findOne)
  .put('/:id', specializations.update)
  .delete('/:id', specializations.delete);

module.exports = router;
