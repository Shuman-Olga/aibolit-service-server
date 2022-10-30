const db = require('../models'),
  Role = db.role;

exports.findAll = (req, res) => {
  Role.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Ошибка',
      });
    });
};
