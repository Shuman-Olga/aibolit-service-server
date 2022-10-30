module.exports = (sequelize, Sequelize) => {
  const Calling = sequelize.define('callings', {
    date: Sequelize.DATEONLY,
    datecall: Sequelize.DATEONLY,
    timestart: Sequelize.STRING,
    timeend: Sequelize.STRING,
    description: Sequelize.TEXT,
  });
  return Calling;
};
