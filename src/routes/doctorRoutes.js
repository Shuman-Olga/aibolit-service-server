const express = require('express'),
  router = express.Router(),
  doctors = require('../controllers/doctorController');

router
  .post('/', doctors.create)
  .get('/', doctors.findAll)
  .get('/:id', doctors.findOne)
  // .get('/:id', doctors.findOne)
  .put('/:id', doctors.update)
  .delete('/:id', doctors.delete);
// .delete('/', doctors.deleteAll);

module.exports = router;
