const express = require('express');
const session = require('express-session');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const passport = require('./middleware/auth');
const sequelize = require('./config/database');
const User = require('./models/user');
const Endpoint = require('./models/endpoint');
const Metric = require('./models/metric');
const routes = require('./routes');
const { startMonitoringAllEndpoints } = require('./controllers/endpointController');


const app = express();
const port = 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  preflightContinue: false,
  credentials: true,
  exposedHeaders: ['set-cookie'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true if using https
    httpOnly: true,
    maxAge: 60 * 60 * 1000 // 1 hour
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes);

// Sync Database
sequelize.sync({ alter: true })  // Ensure it synchronizes the schema
  .then(() => {
    console.log('Database synced')
    startMonitoringAllEndpoints()
  })
  .catch(err => console.log('Error: ' + err));


// Start the server
app.listen(port, () => {
  console.log(`Server runningg on http://localhost:${port}`);
});
