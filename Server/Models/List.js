const mongoose = require('mongoose')

const ListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  apartOfHouse: {
    type: String,
    required: true
  },
})

const ListModel = mongoose.model("lists", ListSchema)
module.exports = ListModel