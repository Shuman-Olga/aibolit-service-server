module.exports = (sequelize, Sequelize) => {
  const Diary = sequelize.define('diarys', {
    diagnosis: Sequelize.STRING,
    claim: Sequelize.STRING,
    anamnesis: Sequelize.STRING,
    therapy: Sequelize.STRING,
    prognosis: Sequelize.STRING,
    published: Sequelize.BOOLEAN,
  });
  return Diary;
};
