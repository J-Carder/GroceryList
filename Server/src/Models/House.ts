import mongoose from "mongoose";

const HouseSchema = new mongoose.Schema({
  lists: {
    type: [String],
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  passphrase: {
    type: String,
    required: true
  }
})

const HouseModel = mongoose.model("houses", HouseSchema)
export default HouseModel; 