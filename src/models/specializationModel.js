module.exports = (sequelize, Sequelize) => {
  const Specialization = sequelize.define('specializations', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: Sequelize.TEXT,
    published: Sequelize.BOOLEAN,
  });
  return Specialization;
};
