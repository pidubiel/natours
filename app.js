//const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log('Hello from the middleware! 👋🏻');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toLocaleString();
  next();
});

// 3) ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//all means all http verbs (GET, POST ...)
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

//Error handling middleware
app.use(globalErrorHandler);

// 4) START SERVER
module.exports = app;
