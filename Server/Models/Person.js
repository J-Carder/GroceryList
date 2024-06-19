const mongoose = require('mongoose')


const PeopleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
}, {collection: "people"})

const PeopleModel = mongoose.model("people", PeopleSchema)
module.exports = PeopleModel