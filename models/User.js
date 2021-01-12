const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  watchLater: [{
    name: { type: String },
    user_id: { type: String },
    profile_image_url: { type: String }
  }]
})

UserSchema.methods.hashPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

UserSchema.methods.hashCompare = function (password) {
  return bcrypt.compareSync(password, this.password)
}

UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = this.hashPassword(this.password)
  }
  next()
})

module.exports = mongoose.model('User', UserSchema)
