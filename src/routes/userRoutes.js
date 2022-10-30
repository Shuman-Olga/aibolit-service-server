const express = require('express'),
  router = express.Router(),
  users = require('../controllers/userController');

router
  .post('/', users.create)
  .get('/', users.findAll)
  .get('/published', users.findAllPublished)
  .get('/doctors', users.findAllsSchedule)
  .get('/:id', users.findOne)
  .put('/:id', users.update)
  .delete('/:id', users.delete);
// // .delete('/', patients.deleteAll);

module.exports = router;
