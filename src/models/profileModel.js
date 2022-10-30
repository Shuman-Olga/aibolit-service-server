module.exports = (sequelize, Sequelize) => {
  const Profile = sequelize.define('profiles', {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return Profile;
};
