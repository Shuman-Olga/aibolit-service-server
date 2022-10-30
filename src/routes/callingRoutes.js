const { authJwt } = require('../middlewares'),
  express = require('express'),
  router = express.Router(),
  callings = require('../controllers/callingController');

router.post('/', callings.create).get('/', callings.findAll);
// .get('/parentnow', patients.findAllParentnow)
// .get('/published', patients.findAllPublished)
// .get('/:id', patients.findOne)
// .put('/:id', patients.update)
// .delete('/:id', patients.delete);
// .delete('/', patients.deleteAll);

module.exports = router;
