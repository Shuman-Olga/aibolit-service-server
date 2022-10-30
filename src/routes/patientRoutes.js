const { authJwt } = require('../middlewares'),
  express = require('express'),
  router = express.Router(),
  patients = require('../controllers/patientController');

router
  .post('/', patients.create, [authJwt.verifyToken])
  .get('/', patients.findAll)
  // .get('/parentnow', patients.findAllParentnow)
  .get('/published', patients.findAllPublished)
  .get('/:id', patients.findOne)
  .put('/:id', patients.update)
  .delete('/:id', patients.delete);
// .delete('/', patients.deleteAll);

module.exports = router;
