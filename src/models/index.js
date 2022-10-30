const Sequelize = require('sequelize'),
  sequelize = require('../config/dbConfig'),
  db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./userModel.js')(sequelize, Sequelize);
db.profile = require('./profileModel.js')(sequelize, Sequelize);
db.role = require('./roleModel.js')(sequelize, Sequelize);
db.specialization = require('./specializationModel.js')(sequelize, Sequelize);

db.patient = require('./patientModel.js')(sequelize, Sequelize);
db.parent = require('./parentModel.js')(sequelize, Sequelize);
db.region = require('./regionModel.js')(sequelize, Sequelize);
db.typedoc = require('./typedocModel.js')(sequelize, Sequelize);

db.calling = require('./callingModel.js')(sequelize, Sequelize);
db.diary = require('./diaryModel.js')(sequelize, Sequelize);
db.price = require('./priceModel.js')(sequelize, Sequelize);
db.contract = require('./contractModel.js')(sequelize, Sequelize);

// Связи
// User-Profile
db.user.hasOne(db.profile);
db.profile.belongsTo(db.user);
// Profile-Role
db.profile.belongsTo(db.role);
db.role.hasMany(db.profile);
// User-Specialization
db.user.belongsTo(db.specialization);
db.specialization.hasMany(db.user);
// Calling
db.calling.belongsTo(db.user);
db.user.hasMany(db.calling);
db.diary.hasOne(db.calling);
db.calling.belongsTo(db.price);
db.price.hasMany(db.calling);
// Contract
db.contract.belongsTo(db.user);
db.user.hasMany(db.contract);
db.contract.belongsTo(db.price);
db.price.hasMany(db.contract);
// Patient
db.calling.belongsTo(db.patient);
db.patient.hasMany(db.calling);
db.contract.belongsTo(db.patient);
db.patient.hasMany(db.contract);

db.patient.belongsTo(db.region);
db.region.hasMany(db.patient);
db.patient.belongsTo(db.typedoc);
db.typedoc.hasMany(db.patient);
// Parent
db.parent.belongsTo(db.region);
db.region.hasMany(db.parent);
db.parent.belongsTo(db.typedoc);
db.typedoc.hasMany(db.parent);
// Patient-Parent
db.patient.belongsToMany(db.parent, {
  through: 'patientparent',
  foreignKey: 'patientId',
  otherKey: 'parentId',
});
db.parent.belongsToMany(db.patient, {
  through: 'patientparent',
  foreignKey: 'parentId',
  otherKey: 'patientId',
});

// db.ROLES = ['user', 'director', 'admin', 'doctor'];

module.exports = db;
