const express = require('express'),
  cors = require('cors'),
  app = express(),
  dotenv = require('dotenv');
dotenv.config();

const routes = require('./src/routes/index');

// let corsOptions = {
//   origin: 'http://localhost:8081',
// };

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome' });
});

const db = require('./src/models');

db.sequelize.sync({ force: false }).then(() => {
  console.log('Drop and Resync Db');
});
app.use('/api', routes);

// set port, listen for requests
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
