const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const ItemModel = require('./Models/Item');
const DepartmentModel = require("./Models/Department");
const PeopleModel = require("./Models/Person");

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
    wantedBy: req.body.wantedBy
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
  const department = req.body.department

  await DepartmentModel.create({
    department: department
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
  const name = req.body.name

  await PeopleModel.create({
    name: name
  })

  res.json({success: true})
})

// ---------------------------- //
// -----   HOUSE ROUTES   ----- //
// ---------------------------- //

app.get("/people", async (req, res) => {
  try {
    let query = await PeopleModel.find()
    res.json(query)
  } catch (e) {
    res.json(e)
  }
})


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
  const name = req.body.name

  await PeopleModel.create({
    name: name
  })

  res.json({success: true})
})

// ---------------------------- //
// -----   LIST ROUTES    ----- //
// ---------------------------- //

app.get("/people", async (req, res) => {
  try {
    let query = await PeopleModel.find()
    res.json(query)
  } catch (e) {
    res.json(e)
  }
})


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
  const name = req.body.name

  await PeopleModel.create({
    name: name
  })

  res.json({success: true})
})

// ---------------------------- //
// ---------------------------- //




app.listen(process.env.PORT, () => {
  console.log("server is running")
})