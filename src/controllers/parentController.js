const db = require('../models'),
  Patient = db.patient,
  Parent = db.parent,
  User = db.user,
  Region = db.region,
  Typedoc = db.typedoc,
  Doctor = db.doctor,
  Price = db.price,
  Op = db.Sequelize.Op;

exports.findAll = async (req, res) => {
  await Parent.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Ошибка',
      });
    });
};
// Update a Patient by the id in the request
exports.update = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.body);
    const id = req.params.id;

    await Parent.update(req.body, { where: { id: id } });
    res.send({
      message: 'Данные обновлены',
    });
  } catch (error) {
    res.status(500).send({
      message: 'Error updating Patient with',
    });
  }
};
