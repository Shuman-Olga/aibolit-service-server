const db = require('../models'),
  Specialization = db.specialization,
  Op = db.Sequelize.Op;
// pagination
const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: specializations } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, specializations, totalPages, currentPage };
};
// Create Specialization
exports.create = async (req, res) => {
  // validate
  if (!req.body.data.name) {
    res.status(400).send({
      message: 'Введите название специализации ',
    });
    return;
  }
  if ((await Specialization.findOne({ where: { name: req.body.data.name } })) !== null) {
    res.status(400).send({
      message: 'Такая специализация уже существует',
    });
    return;
  }

  await Specialization.create(req.body.data)
    .then((data) => {
      res.send({ message: 'Специализация создана' });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Ошибка',
      });
    });
};
// Retrieve all Specialization from the database.
exports.findAll = async (req, res) => {
  const { page, size, value } = req.query;
  const { limit, offset } = getPagination(page, size);

  await Specialization.findAndCountAll({
    where: value
      ? {
          [Op.or]: [{ name: { [Op.like]: `%${value}%` } }],
        }
      : null,
    limit,
    offset,
    order: ['id'],
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
// Find a single Specialization with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  await Specialization.findByPk(id)
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
// Update a Specialization by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  await Specialization.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Специализация изменена',
        });
      } else {
        res.send({
          message: `Не удается обновить специализацию!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Ошибка',
      });
    });
};
// Delete a Specialization with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;
  await Specialization.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Специализация удалена',
        });
      } else {
        res.send({
          message: 'Не получилось удалить',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Ошибка',
      });
    });
};

// Find all published Specialization
exports.findAllPublished = async (req, res) => {
  console.log(req.query);
  const { page, size } = req.query;
  if (page && size) {
    const { limit, offset } = getPagination(page, size);
    await Specialization.findAndCountAll({ where: { published: true }, limit, offset })
      .then((data) => {
        const response = getPagingData(data, page, limit);
        res.send(response);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'Ошибка',
        });
      });
  } else {
    await Specialization.findAll({ where: { published: true } })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'Ошибка',
        });
      });
  }
};
