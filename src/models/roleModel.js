module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define(
    'roles',
    {
      name: Sequelize.STRING,
      runame: Sequelize.STRING,
    },
    {
      timestamps: false,
    },
  );
  return Role;
};
