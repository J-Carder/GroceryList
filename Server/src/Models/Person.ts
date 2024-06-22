import mongoose from "mongoose";

const PeopleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // apartOfHouse: {
  //   type: String,
  //   required: true
  // }
}, {collection: "people"})

const PeopleModel = mongoose.model("people", PeopleSchema)
export default PeopleModel;