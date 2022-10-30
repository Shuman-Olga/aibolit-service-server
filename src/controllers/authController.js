const db = require('../models'),
  Profile = db.profile,
  User = db.user,
  Role = db.role,
  Specialization = db.specialization,
  Op = db.Sequelize.Op,
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcryptjs'),
  secretKey = process.env.SECRET_KEY;

exports.signin = async (req, res) => {
  console.log(req.body);
  await Profile.findOne({
    where: {
      email: req.body.data.email,
    },
    include: [
      {
        model: User,
        attributes: ['lastname', 'firstname', 'phone'],
        include: { model: Specialization, attributes: ['name'] },
      },
      {
        model: Role,
        attributes: ['name', 'runame'],
      },
    ],
  })
    .then((profile) => {
      console.log(profile);
      if (!profile) {
        return res.status(404).send({ message: 'Пользователь не существует.' });
      }
      console.log(bcrypt.hashSync(req.body.data.password, 8));
      console.log(profile.password);
      var passwordIsValid = bcrypt.compareSync(
        req.body.data.password,
        profile.password,
        // bcrypt.hashSync(profile.password, 8),
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Пароль не верен!',
        });
      }
      console.log(profile.role);
      var token = jwt.sign({ id: profile.id }, secretKey, {
        expiresIn: '24h', // 24 hours
      });
      res.status(200).send({
        id: profile.id,
        email: profile.email,
        role: profile.role,
        accessToken: token,
        user: profile.user,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
