const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const ItemModel = require('./Models/Item');
const DepartmentModel = require("./Models/Department");
const PeopleModel = require("./Models/Person");
const HouseModel = require('./Models/House');
const ListModel = require('./Models/List');

// init dotenv
dotenv.config()

const app = express()
// middleware
app.use(cors())
app.use(express.json())

// connect to mongoDB
mongoose.connect(process.env.DB)

// ---------------------------- //
// ----- TODO LIST ROUTES ----- //
// ---------------------------- //

app.get("/items", async (req, res) => {
  try {
    let query = await ItemModel.find()
    res.json(query)
  } catch (e) {
    res.json(e)
  }
})

app.get("/items/:id", async (req, res) => {
  try {
    let query = await ItemModel.findById(req.params.id)
    res.json(query)
  } catch (e) {
    res.json(e)
  }
})

app.put("/items/:id", async (req, res) => {
  const {id} = req.params
  const completed = req.body.completed
  const query = await ItemModel.findByIdAndUpdate({_id: id}, {completed: completed})
  res.json({success: true})
})

app.delete("/items/:id", async (req, res) => {
  const {id} = req.params
  const query = await ItemModel.findByIdAndDelete({_id: id})
  res.json({success: true})
})

app.post("/items", async (req, res) => {

  await ItemModel.create({
    item: req.body.item,
    department: req.body.department,
    wantedBy: req.body.wantedBy,
    apartOfList: req.body.apartOfList
  })

  res.json({success: true})
})


// ---------------------------- //
// -----   DEPTS ROUTES   ----- //
// ---------------------------- //

app.get("/departments", async (req, res) => {
  try {
    let query = await DepartmentModel.find()
    res.json(query)
  } catch (e) {
    res.json(e)
  }
})

// probably not needed
app.put("/departments/:id", async (req, res) => {
  const {id} = req.params
  const department = req.body.department
  const query = await DepartmentModel.findByIdAndUpdate({_id: id}, {department: department})
  res.json({success: true})
})

app.delete("/departments/:id", async (req, res) => {
  const {id} = req.params
  const query = await DepartmentModel.findByIdAndDelete({_id: id})
  res.json({success: true})
})

app.post("/departments", async (req, res) => {

  await DepartmentModel.create({
    department: req.body.department,
    apartOfHouse: req.body.apartOfHouse
  })

  res.json({success: true})
})

// ---------------------------- //
// -----   PEOPLE ROUTES  ----- //
// ---------------------------- //

app.get("/people", async (req, res) => {
  try {
    let query = await PeopleModel.find()
    res.json(query)
  } catch (e) {
    res.json(e)
  }
})

// probably not needed
app.put("/people/:id", async (req, res) => {
  const {id} = req.params
  const name = req.body.name
  const query = await PeopleModel.findByIdAndUpdate({_id: id}, {name: name})
  res.json({success: true})
})

app.delete("/people/:id", async (req, res) => {
  const {id} = req.params
  const query = await PeopleModel.findByIdAndDelete({_id: id})
  res.json({success: true})
})

app.post("/people", async (req, res) => {

  await PeopleModel.create({
    name: req.body.name,
    apartOfHouse: apartOfHouse
  })

  res.json({success: true})
})

// ---------------------------- //
// -----   HOUSE ROUTES   ----- //
// ---------------------------- //

app.get("/houses", async (req, res) => {
  try {
    let query = await HouseModel.find()
    res.json(query)
  } catch (e) {
    res.json(e)
  }
})

// TODO: this
app.put("/houses/:id", async (req, res) => {
  const {id} = req.params
  // const name = req.body.name
  // const query = await HouseModel.findByIdAndUpdate({_id: id}, {name: name})
  res.json({success: true})
})

app.delete("/house/:id", async (req, res) => {
  const {id} = req.params
  const query = await HouseModel.findByIdAndDelete({_id: id})
  res.json({success: true})
})

app.post("/house", async (req, res) => {
  await HouseModel.create({
    name: req.body.name,
    passphrase: req.body.passphrase
  })

  res.json({success: true})
})

// ---------------------------- //
// -----   LIST ROUTES    ----- //
// ---------------------------- //

app.get("/lists", async (req, res) => {
  try {
    let query = await ListModel.find()
    res.json(query)
  } catch (e) {
    res.json(e)
  }
})

// TODO: this
app.put("/lists/:id", async (req, res) => {
  const {id} = req.params
  // const name = req.body.name
  // const query = await PeopleModel.findByIdAndUpdate({_id: id}, {name: name})
  res.json({success: true})
})

app.delete("/lists/:id", async (req, res) => {
  const {id} = req.params
  const query = await PeopleModel.findByIdAndDelete({_id: id})
  res.json({success: true})
})

app.post("/lists", async (req, res) => {

  await PeopleModel.create({
    name: req.body.name,
    apartOfHouse: req.body.apartOfHouse
  })

  res.json({success: true})
})

// ---------------------------- //
// -----   START SERVER   ----- //
// ---------------------------- //

app.listen(process.env.PORT, () => {
  console.log("--- Server is UP and running ---")
})

// ---------------------------- //
// ---------------------------- //


