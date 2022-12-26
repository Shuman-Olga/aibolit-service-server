const express = require('express'),
  router = express.Router(),
  authRouter = require('./authRoutes'),
  userRouter = require('./userRoutes'),
  patientsRoutes = require('./patientRoutes'),
  rolesRoutes = require('./roleRoutes'),
  pricesRoutes = require('./priceRoutes'),
  specializationsRoutes = require('./specializationRoutes'),
  typedocsRoutes = require('./typedocRoutes'),
  parentsRoutes = require('./parentRoutes'),
  callingsRoutes = require('./callingRoutes'),
  contractsRoutes = require('./contractRoutes'),
  regionsRoutes = require('./regionRoutes');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
  next();
});

router.use('/', authRouter);
router.use('/roles', rolesRoutes);
router.use('/users', userRouter);
router.use('/regions', regionsRoutes);
router.use('/typedocs', typedocsRoutes);

router.use('/patients', patientsRoutes);
router.use('/parents', parentsRoutes);
router.use('/prices', pricesRoutes);
router.use('/callings', callingsRoutes);
router.use('/contracts', contractsRoutes);
router.use('/specializations', specializationsRoutes);

module.exports = router;
