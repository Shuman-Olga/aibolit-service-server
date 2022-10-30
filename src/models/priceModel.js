module.exports = (sequelize, Sequelize) => {
  const Price = sequelize.define('prices', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    published: Sequelize.BOOLEAN,
  });
  return Price;
};
