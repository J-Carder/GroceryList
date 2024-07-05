import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
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
  }, 
  apartOfList: {
    type: String,
    required: true
  },
  tempId: {
    type: String
  },
  originalTimeCreated: {
    type: String
  },
  tempApartOfList: {
    type: String
  }
})

const ItemModel = mongoose.model("items", ItemSchema)
export default ItemModel;