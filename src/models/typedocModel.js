module.exports = (sequelize, Sequelize) => {
  const Typedoc = sequelize.define(
    'typedocs',
    {
      name: Sequelize.STRING,
    },
    {
      timestamps: false,
    },
  );
  return Typedoc;
};
