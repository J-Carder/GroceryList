const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  houses: {
    type: [String],
  }
})

const UsersModel = mongoose.model("users", UsersSchema)
module.exports = UsersModel