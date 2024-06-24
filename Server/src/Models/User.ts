import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
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
  mod: {
    type: Boolean,
    default: false
  },
  houses: {
    type: [String],
  }
})

const UsersModel = mongoose.model("users", UsersSchema)
export default UsersModel;