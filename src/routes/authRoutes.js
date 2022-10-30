const { verifySignUp } = require('../middlewares'),
  express = require('express'),
  router = express.Router(),
  controller = require('../controllers/authController');

router
  // .post(
  //   '/register',
  //   [verifySignUp.checkDuplicateEmail, verifySignUp.checkRolesExisted],
  //   controller.signup,
  // )
  .post('/login', controller.signin);
module.exports = router;
