const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

// express app
const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// routes
app.use('/blogs', blogRoutes);

// 404 page
