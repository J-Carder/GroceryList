import mongoose from "mongoose";

const DepartmentsSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true
  },
  apartOfHouse: {
    type: String,
    required: true
  }
})

const DepartmentsModel = mongoose.model("departments", DepartmentsSchema)
export default DepartmentsModel;