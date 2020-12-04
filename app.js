const express = require('express');
const session = requires('express-session');
const morgan = require('morgan');
const mongoose = require('mongoose');
const createError = require('http-errors');

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
app.use('/blogs', blogRoutes);

// 404 page
