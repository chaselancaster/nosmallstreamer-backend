const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const StreamerSchema = new mongoose.Schema({
  name: { type: String },
  score: { type: Number, default: 0 },
  user_id: { type: String },
  profile_image_url: { type: String }
})

module.exports = mongoose.model('Streamer', StreamerSchema)
