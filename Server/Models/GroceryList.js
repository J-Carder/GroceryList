const mongoose = require('mongoose')


const GroceryListSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  wantedBy: {
    type: String,
    default: ""
  },
  department: {
    type: String,
    default: ""
  } 
})

const GroceryListModel = mongoose.model("items", GroceryListSchema)
module.exports = GroceryListModel