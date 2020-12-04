const express = require('express');
const session = requires('express-session');
const morgan = require('morgan');
const mongoose = require('mongoose');
const createError = require('http-errors');

require('dotenv').config();

const PORT = process.env.PORT;

// express app
const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'chase',
  resave: false,
  saveUninitialized: false
}))
app.use(morgan('dev'));

// routes

// Catching error
app.use((req, res, next) => {
  next(createError(404));
})

app.listen(PORT, err => {
  console.log(err || 'App is listening on port, ', PORT)
})

module.exports = app;
