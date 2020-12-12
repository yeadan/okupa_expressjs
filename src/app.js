import express, { json } from 'express'
import { sequelize } from './data/database'
import morgan from 'morgan'
import dataCache from 'node-cache';

//Importing routes
import propertyRoutes from './routes/properties'
import userRoutes from './routes/users'
import okupaRoutes from './routes/okupas'
import ownerRoutes from './routes/owners'
import userOkupaRoutes from './routes/userOkupas'

var cors = require('cors')

//Initializing
const app = express()

//Middlewares
app.use(morgan('dev'))

app.use(cors())
app.use(json())
app.use(express.static('public'));
app.use(express.static('images'));

//Routes
app.use('/properties', propertyRoutes)
app.use('/users', userRoutes)
app.use('/owners', ownerRoutes)
app.use('/okupas', okupaRoutes)
app.use('/okupas', userOkupaRoutes)

// error 404
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
// error handler middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || 'Internal Server Error',
    },
  });
});



//Creating Tables from Database
sequelize.sync()

//Initializing cache (1h)
const ttlSeconds = 1 * 60 * 60;
export const cache = new dataCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
cache.flushAll()

export default app