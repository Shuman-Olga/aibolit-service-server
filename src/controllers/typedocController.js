const db = require('../models'),
  Typedoc = db.typedoc;

exports.findAll = async (req, res) => {
  await Typedoc.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Ошибка',
      });
    });
};
