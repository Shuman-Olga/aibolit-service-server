module.exports = (sequelize, Sequelize) => {
  const Patient = sequelize.define('patients', {
    lastname: Sequelize.STRING,
    firstname: Sequelize.STRING,
    patronymic: Sequelize.STRING,
    birthday: Sequelize.TEXT,
    gender: Sequelize.STRING,
    description: Sequelize.TEXT,
    phone: Sequelize.STRING,
    email: Sequelize.STRING,
    policy: Sequelize.STRING,
    snils: Sequelize.STRING,
    medicalinsurancecompany: Sequelize.STRING,
    inn: Sequelize.STRING,
    series: Sequelize.STRING,
    number: Sequelize.STRING,
    dateissued: Sequelize.STRING,
    whoissued: Sequelize.STRING,
    city: Sequelize.STRING,
    district: Sequelize.STRING,
    locality: Sequelize.STRING,
    street: Sequelize.STRING,
    house: Sequelize.STRING,
    apartment: Sequelize.STRING,
    index: Sequelize.STRING,
    school: Sequelize.STRING,
    disability: Sequelize.STRING,
    blood: Sequelize.STRING,
    allergy: Sequelize.STRING,
    published: Sequelize.BOOLEAN,
  });

  return Patient;
};
