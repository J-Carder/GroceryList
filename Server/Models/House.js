const mongoose = require('mongoose')

const HouseSchema = new mongoose.Schema({
  lists: {
    type: [String],
  },
  name: {
    type: String,
    required: true
  },
  passphrase: {
    type: String,
    required: true
  }
})

const HouseModel = mongoose.model("houses", HouseSchema)
module.exports = HouseModel