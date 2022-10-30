const db = require('../models'),
  ROLES = db.ROLES,
  Profile = db.profile;

checkDuplicateEmail = (req, res, next) => {
  // Email
  Profile.findOne({
    where: {
      email: req.body.email,
    },
  }).then((profile) => {
    if (profile) {
      res.status(400).send({
        message: 'Email уже используется!',
      });
      return;
    }
    next();
    // Email
    // User.findOne({
    //   where: {
    //     email: req.body.email,
    //   },
    // }).then((user) => {
    //   if (user) {
    //     res.status(400).send({
    //       message: 'Failed! Email is already in use!',
    //     });
    //     return;
    //   }
    //   next();
    // });
  });
};
checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    req.body.roles.forEach((item) => {
      if (!ROLES.includes(item)) {
        res.status(400).send({
          message: 'Таких прав нет',
        });
        return;
      }
    });
  }

  next();
};
const verifySignUp = {
  checkDuplicateEmail: checkDuplicateEmail,
  checkRolesExisted: checkRolesExisted,
};
module.exports = verifySignUp;
