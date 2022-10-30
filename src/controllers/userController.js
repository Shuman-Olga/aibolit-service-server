const db = require('../models'),
  User = db.user,
  Specialization = db.specialization,
  Profile = db.profile,
  Role = db.role,
  bcrypt = require('bcryptjs'),
  Op = db.Sequelize.Op;
// Pagination
const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: users } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, users, totalPages, currentPage };
};
// Create and Save a new User
exports.create = async (req, res) => {
  console.log(req.body);
  // validate
  if (!req.body.data.lastname || !req.body.data.firstname) {
    res.status(400).send({
      message: 'Укажит фамилию или имя сотрудника',
    });
    return;
  }
  if (
    (await User.findOne({
      where: {
        [Op.and]: [
          { firstname: req.body.data.firstname },
          { lastname: req.body.data.lastname },
          { patronymic: req.body.data.patronymic },
          { birthday: req.body.data.birthday },
          { phone: req.body.data.phone },
        ],
      },
      include: {
        model: Specialization,
      },
    })) !== null
  ) {
    res.status(400).send({
      message: `Сотрудник ${req.body.data.firstname} ${req.body.data.lastname} ${req.body.data.patronymic} уже существует`,
    });
    return;
  }
  if (!req.body.data.specializationId) {
    res.status(400).send({
      message: 'Укажите специализацию сотрудника',
    });
    return;
  }

  if (req.body.data.accessToSystem === true) {
    if (!req.body.profile.email || !req.body.profile.password || !req.body.profile.roleId) {
      res.status(400).send({
        message: 'Введите email, пароль и права сотрудника',
      });
      return;
    }
    if (
      (await Profile.findOne({
        where: {
          email: req.body.profile.email,
        },
      })) !== null
    ) {
      res.status(400).send({
        message: `${req.body.profile.email} уже используется`,
      });
      return;
    }
  }
  await User.create(req.body.data)
    .then((user) => {
      Specialization.findByPk(req.body.data.specializationId).then((specialization) => {
        user.setSpecialization(specialization);
      });
      if (req.body.data.accessToSystem === true) {
        Profile.create({
          email: req.body.profile.email,
          password: bcrypt.hashSync(req.body.profile.password, 8),
        }).then((profile) => {
          Role.findByPk(req.body.profile.roleId).then((role) => {
            profile.setRole(role);
            profile.setUser(user);
          });
        });
      }
      res.send({ message: 'Сотрудник создан' });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Ошибка',
      });
    });
};
// Retrieve all Users from the database.
exports.findAll = async (req, res) => {
  const { page, size, value } = req.query;
  const { limit, offset } = getPagination(page, size);

  await User.findAndCountAll({
    where: value
      ? {
          [Op.or]: [
            { lastname: { [Op.like]: `%${value}%` } },
            { firstname: { [Op.like]: `%${value}%` } },
            { phone: { [Op.like]: `${value}%` } },
          ],
        }
      : null,
    limit,
    offset,
    order: ['id'],
    include: [Specialization],
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Ошибка',
      });
    });
};
// Find a single User with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  await User.findByPk(id, {
    include: [Specialization, Profile],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Нет такого сотрудника`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Ошибка',
      });
    });
};
// Update a User by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  await User.update(req.body.data, {
    where: { id: id },
  })
    .then((result) => {
      if (result) {
        res.send({
          message: 'Изменения внесены',
        });
      } else {
        res.send({
          message: `Ошибка`,
        });
      }
      if (req.body.data.accessToSystem === true) {
        Profile.update(req.body.profile, { where: { id: req.body.profile.id } });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Ошибка',
      });
    });
};
// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Сотрудник удален',
        });
      } else {
        res.send({
          message: `Ошибка`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Ошибка',
      });
    });
};
// Find all published User
exports.findAllPublished = async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  await User.findAll({ where: { published: true } }, limit, offset)
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
// Find all Doctors
exports.findAllsSchedule = async (req, res) => {
  // const { page, size } = req.query;
  // const { limit, offset } = getPagination(page, size);
  await User.findAll({ where: { showinschedule: true } })
    .then((data) => {
      // const response = getPagingData(data, page, limit);
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Ошибка',
      });
    });
};
