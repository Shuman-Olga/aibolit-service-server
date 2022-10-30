const db = require('../models'),
  Region = db.region;

exports.findAll = async (req, res) => {
  await Region.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Ошибка',
      });
    });
};
