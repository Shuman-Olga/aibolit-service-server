const { authJwt } = require('../middlewares'),
  express = require('express'),
  router = express.Router(),
  contracts = require('../controllers/contractController');

router
  .get('/:id', contracts.findOne)
  .post('/', contracts.create)
  .get('/', contracts.findAll)
  .put('/:id', contracts.update);
// .delete('/:id', patients.delete);
// .delete('/', patients.deleteAll);

module.exports = router;
