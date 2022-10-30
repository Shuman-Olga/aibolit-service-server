const db = require('../models'),
  Price = db.price,
  Op = db.Sequelize.Op;
// pagination
const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: price } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, price, totalPages, currentPage };
};
// Create Price
exports.create = async (req, res) => {
  // validate
  if (!req.body.data.name || !req.body.data.price) {
    res.status(400).send({
      message: 'Введите наименование услуги и стоимость',
    });
    return;
  }
  if (await Price.findOne({ where: { name: req.body.data.name } })) {
    res.status(400).send({
      message: 'Такая услугу уже существует',
    });
    return;
  }
  await Price.create(req.body.data)
    .then((price) => {
      res.send({ message: 'Услуга создана' });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Ошибка',
      });
    });
};
// Retrieve all Price from the database.
exports.findAll = async (req, res) => {
  const { page, size, value } = req.query;
  const { limit, offset } = getPagination(page, size);

  await Price.findAndCountAll({
    where: value
      ? {
          [Op.or]: [{ name: { [Op.like]: `%${value}%` } }, { price: { [Op.like]: `%${value}%` } }],
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
// Find a single Price with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  await Price.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Нет такой услуги.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Ошибка',
      });
    });
};
// Update a Price by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  await Price.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Услуга изменена',
        });
      } else {
        res.send({
          message: `Не удается обновить услугу!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Ошибка',
      });
    });
};
// Delete a Price with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;
  await Price.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Услуга удалена',
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
// Find all published Prices
exports.findAllPublished = async (req, res) => {
  const { page, size } = req.query;
  if (page && size) {
    const { limit, offset } = getPagination(page, size);
    await Price.findAll({ where: { published: true }, limit, offset })
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
    await Price.findAll({ where: { published: true } })
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
