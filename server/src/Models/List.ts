import mongoose from "mongoose";

const ListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  apartOfHouse: {
    type: String,
    required: true
  },
  tempId: {
    type: String
  }
})

const ListModel = mongoose.model("lists", ListSchema)
export default ListModel;