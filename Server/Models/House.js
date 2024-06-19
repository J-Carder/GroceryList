const mongoose = require('mongoose')

const HouseSchema = new mongoose.Schema({
  lists: {
    type: [string],
  },
  name: {
    type: string,
    required: true
  }
})

const HouseModel = mongoose.model("houses", HouseSchema)
module.exports = HouseModel