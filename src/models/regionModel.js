module.exports = (sequelize, Sequelize) => {
  const Region = sequelize.define(
    'regions',
    {
      code: Sequelize.STRING,
      name: Sequelize.STRING,
    },
    {
      timestamps: false,
    },
  );
  return Region;
};
