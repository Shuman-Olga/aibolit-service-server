const db = require('../models'),
  Contract = db.contract,
  Patient = db.patient,
  Parent = db.parent,
  Price = db.price,
  User = db.user,
  Specialization = db.specialization,
  Op = db.Sequelize.Op;

// pagination
const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: contracts } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, contracts, totalPages, currentPage };
};
// Create and Save a new Contract
exports.create = async (req, res) => {
  // Validate request
  let patient;
  let contract;
  let parent;
  console.log(req.body);
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
  if (!req.body.contract.userId) {
    res.status(400).send({
      message: 'Выбирите врача',
    });
    return;
  }
  if (!req.body.contract.priceId) {
    res.status(400).send({
      message: 'Выбирите услугу',
    });
    return;
  }
  // Save Patient in the database
  try {
    contract = await Contract.create(req.body.contract);
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
    contract.setPatient(patient);
    res.send({ message: 'Договор оформлен' });
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating the Patient.',
    });
  }
};
// Get all ontracts from the database.
exports.findAll = async (req, res) => {
  const { page, size, value } = req.query;
  const { limit, offset } = getPagination(page, size);

  await Contract.findAndCountAll({
    where: value
      ? {
          [Op.or]: [{ datestart: { [Op.like]: `%${value}%` } }],
        }
      : null,
    limit,
    offset,
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
        include: Specialization,
      },
      Price,
    ],
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Patients.',
      });
    });
};
// Find a single Contract with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  await Contract.findByPk(id, {
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
        include: Specialization,
      },
      Price,
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Нет такой специализации.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Ошибка',
      });
    });
};
// Update a Contract by the id in the request
exports.update = async (req, res) => {
  console.log(req.body.parent, req.params.id);
  let contract;
  let patient;
  let parent;
  if (!req.body.patient.lastname && !req.body.patient.firstname) {
    res.status(400).send({
      message: 'Необходимо указать фамилию или имя пациента',
    });
    return;
  }
  try {
    const id = req.params.id;
    contract = await Contract.update(req.body.contract, {
      where: { id: id },
    });
    patient = await Patient.findByPk(req.body.patient.id, { include: { all: true } });
    await patient.update(req.body.patient);
    if (req.body.parent.id) {
      parent = await Parent.update(req.body.parent, {
        where: { id: req.body.parent.id },
      });
    } else if (
      req.body.parent.lastname ||
      req.body.parent.firstname ||
      req.body.parent.patronomic
    ) {
      console.log(patient);
      Parent.create(req.body.parent).then((parent) => {
        patient.addParents(parent);
      });
    }
    // if (req.body.parents) {
    //   req.body.parents.forEach((item) => {
    //     console.log(item, item.id);
    //     if (item.id) {
    //       Parent.update(item, { where: { id: item.id } });
    //     } else {
    //       Parent.create(item).then((parent) => {
    //         patient.addParents(parent);
    //         console.log(patient);
    //         console.log(parent);
    //       });
    //     }
    //   });
    // }
    res.send({
      message: 'Данные обновлены',
    });
  } catch (error) {
    res.status(500).send({
      message: 'Error updating Contract',
    });
  }
  // console.log(req.body, req.params.id);
  // const id = req.params.id;
  // Patient.update(req.body.data, {
  //   where: { id: id },
  // })
  //   .then((num) => {
  //     if (req.body.parents) {
  //     }
  //     if (num == 1) {
  //       res.send({
  //         message: 'Patient was updated successfully.',
  //       });
  //     } else {
  //       res.send({
  //         message: `Cannot update Patient with id=${id}. Maybe Patient was not found or req.body is empty!`,
  //       });
  //     }
  //   })
  //   .catch((err) => {
  //     res.status(500).send({
  //       message: 'Error updating Patient with id=' + id,
  //     });
  //   });
};
