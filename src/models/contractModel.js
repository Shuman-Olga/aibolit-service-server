module.exports = (sequelize, Sequelize) => {
  const Contract = sequelize.define('contracts', {
    datestart: Sequelize.DATEONLY,
    dateend: Sequelize.DATEONLY,
    description: Sequelize.TEXT,
  });
  return Contract;
};
