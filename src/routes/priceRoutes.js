const express = require('express'),
  router = express.Router(),
  prices = require('../controllers/priceController');

router
  .post('/', prices.create)
  .get('/', prices.findAll)
  .get('/published', prices.findAllPublished)
  .get('/:id', prices.findOne)
  .put('/:id', prices.update)
  .delete('/:id', prices.delete);

module.exports = router;
