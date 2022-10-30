const db = require('../models'),
  Calling = db.calling,
  Patient = db.patient,
  Price = db.price,
  User = db.user,
  Parent = db.parent,
  Op = db.Sequelize.Op;

// Create and Save a new Patient
exports.create = async (req, res) => {
  // Validate request
  let patient;
  let calling;
  let parent;

  if (!req.body.patient.lastname && !req.body.patient.firstname) {
    res.status(400).send({
      message: 'Необходимо указать фамилию или имя пациента',
    });
    return;
  }
  if (!req.body.patient.phone) {
    res.status(400).send({
      message: 'Необходимо указать телефон',
    });
    return;
  }
  if (!req.body.calling.userId) {
    res.status(400).send({
      message: 'Выбирите врача',
    });
    return;
  }
  if (!req.body.calling.priceId) {
    res.status(400).send({
      message: 'Выбирите услугу',
    });
    return;
  }
  // Save Patient in the database
  try {
    calling = await Calling.create(req.body.calling);
    if (!req.body.patient.id) {
      patient = await Patient.create(req.body.patient);
    } else {
      patient = await Patient.findByPk(req.body.patient.id, { include: { all: true } });
      if (!patient) {
        res.send({ message: 'Нет такого пациента' });
      }
    }
    if (req.body.parent.lastname || req.body.parent.firstname || req.body.parent.patronomic) {
      if (req.body.parent.id) {
        parent = await Parent.findByPk(req.body.parent.id, { include: { all: true } });
        if (!parent) {
          res.send({ message: 'Нет такого обьекта' });
        }
        return;
      } else {
        parent = await Parent.create(req.body.parent);
      }
      patient.addParents(parent);
    }
    calling.setPatient(patient);
    res.send({ message: 'Вызов оформлен' });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating the Patient.',
    });
  }
  // await Calling.create(req.body.calling)
  //   .then((calling) => {
  //     if (!req.body.patient.id) {
  //       Patient.create(req.body.patient).then((patient) => {
  //         calling.setPatient(patient);
  //       });
  //     } else {
  //       Patient.findByPk(req.body.patient.id, { include: { all: true } }).then((patient) => {
  //         calling.setPatient(patient);
  //       });
  //     }
  //     // if (req.body.patient.lastname || req.body.patient.firstname) {
  //     //   Patient.create(req.body.parent).then((patient) => {
  //     //     patient.setParent(parent);
  //     //   });
  //     //   // Parent.create(req.body.parents).then((parent) => {
  //     //   //   patient.setParents(parent);
  //     //   // });
  //     //   console.log(req.body.parents.length);
  //     // }
  //     res.send({ message: 'Вызов оформлен' });
  //   })
  //   .catch((err) => {
  //     res.status(500).send({
  //       message: err.message || 'Some error occurred while creating the Patient.',
  //     });
  //   });
};
// Retrieve all Patients from the database.
exports.findAll = async (req, res) => {
  // const lastname:
  // const { page, size, firstname } = req.query;
  const value = req.query.value;
  // var condition = value ? { lastname: { [Op.like]: `%${value}%` } } : null;
  // const { limit, offset } = getPagination(page, size);
  await Calling.findAll({
    where: value
      ? {
          [Op.or]: [{ date: { [Op.like]: `${value}` } }],
        }
      : null,
    order: ['id'],
    include: [
      {
        model: Patient,
        include: {
          model: Parent,
          where: { [Op.and]: [{ parentnow: true, published: true }] },
          required: false,
        },
      },
      {
        model: User,
      },
      Price,
    ],
  })
    .then((data) => {
      // const response = getPagingData(data, page, limit);
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Patients.',
      });
    });
};
