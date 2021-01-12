require('dotenv').config()

const express = require('express')
const session = require('express-session')
const morgan = require('morgan')
const mongoose = require('mongoose')
const createError = require('http-errors')
const cors = require('cors')

const PORT = process.env.PORT

// routers
const usersRouter = require('./routes/users')
const apiRouter = require('./routes/api')
const leaderboardRouter = require('./routes/leaderboard')

// db / mongoose
require('./db/db')

// express app
const app = express()

// middleware
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
  secret: 'chase',
  resave: false,
  saveUninitialized: false
}))
app.use(morgan('dev'))

// routes
app.use('/users', usersRouter)
app.use('/api', apiRouter)
app.use('/leaderboard', leaderboardRouter)

// Catching error
app.use((req, res, next) => {
  next(createError(404))
})

app.listen(PORT || 3001, err => {
  console.log(err || 'App is listening on port, ', PORT)
})

module.exports = app
