const db = require('../models'),
  Patient = db.patient,
  Parent = db.parent,
  Region = db.region,
  Typedoc = db.typedoc,
  Op = db.Sequelize.Op;
// Pagination
const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: patients } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, patients, totalPages, currentPage };
};
// Create and Save a new Patient
exports.create = async (req, res) => {
  // Validate request
  console.log(req.body);
  if (!req.body.data.lastname) {
    res.status(400).send({
      message: 'Укажите Фамилию или имя пациента',
    });
    return;
  }

  // Dublicat Patient
  // const patient = await Patient.findAll({
  //   where: {
  //     [Op.and]: [
  //       { lastname: req.body.data.lastname },
  //       { firstname: req.body.data.firstname },
  //       { patronymic: req.body.data.patronymic },
  //       { phone: req.body.data.phone },
  //     ],
  //   },
  //   include: { all: truе },
  // });
  // if (patient) {
  //   res.status(400).send({ message: 'Такой пациент уже существует' });
  //   return;
  // }
  // Save Patient in the database
  await Patient.create(req.body.data)
    .then((patient) => {
      if (req.body.parents.length) {
        req.body.parents.forEach((item) => {
          Parent.create(item).then((parent) => {
            patient.setParents(parent);
          });
        });
        console.log(req.body.parents.length);
      }
      res.send({ message: 'Пациент добавлен' });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Patient.',
      });
    });
};
// Retrieve all Patients from the database.
exports.findAll = async (req, res) => {
  const { page, size, value } = req.query;
  const { limit, offset } = getPagination(page, size);

  await Patient.findAndCountAll({
    where: value
      ? {
          [Op.or]: [
            { lastname: { [Op.like]: `${value}%` } },
            { firstname: { [Op.like]: `${value}%` } },
            { phone: { [Op.like]: `${value}%` } },
          ],
        }
      : null,
    limit,
    offset,
    order: ['id'],
    include: [
      {
        model: Parent,
        where: { [Op.and]: [{ parentnow: true, published: true }] },
        required: false,
      },
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
// Find a single Patient with an id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const patient = await Patient.findByPk(id, {
      include: [{ model: Parent, where: { published: true }, required: false }, Region, Typedoc],
    });
    if (!patient) {
      res.status(404).send({
        message: `Cannot find Patient with id=${id}.`,
      });
    } else {
      res.json(patient);
    }
  } catch (error) {
    res.status(500).send({
      message: 'Error retrieving Patient with ',
    });
  }
};
// Update a Patient by the id in the request
exports.update = async (req, res) => {
  console.log(req.body);
  try {
    const id = req.params.id;
    const patient = await Patient.findByPk(id, {
      include: [Parent, Region, Typedoc],
    });
    // console.log(patient);
    await patient.update(req.body.data);
    if (req.body.parents) {
      req.body.parents.forEach((item) => {
        // console.log(item, item.id);
        if (item.id) {
          Parent.update(item, { where: { id: item.id } });
        } else {
          Parent.create(item).then((parent) => {
            patient.addParents(parent);
            // console.log(patient);
            // console.log(parent);
          });
        }
      });
    }
    res.send({
      message: 'Данные обновлены',
    });
  } catch (error) {
    res.status(500).send({
      message: 'Error updating Patient with',
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
// Delete a Patient with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Patient.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Patient was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Patient with id=${id}. Maybe Patient was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Patient with id=' + id,
      });
    });
};
// Find all published Patients
exports.findAllPublished = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  Patient.findAll({ where: { published: true } }, limit, offset)
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
