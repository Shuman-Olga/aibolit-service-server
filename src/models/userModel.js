module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    lastname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    firstname: Sequelize.STRING,
    patronymic: Sequelize.STRING,
    birthday: Sequelize.STRING,
    phone: Sequelize.STRING,
    snils: Sequelize.STRING,
    inn: Sequelize.STRING,
    description: Sequelize.TEXT,
    accessToSystem: Sequelize.BOOLEAN,
    showinschedule: Sequelize.BOOLEAN,
    published: Sequelize.BOOLEAN,
  });

  return User;
};
