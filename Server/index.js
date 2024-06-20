if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ItemModel = require('./Models/Item');
const DepartmentModel = require("./Models/Department");
const PeopleModel = require("./Models/Person");
const HouseModel = require('./Models/House');
const ListModel = require('./Models/List');
const bcrypt = require("bcrypt");
const UsersModel = require('./Models/User');
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const initialize = require("./Passport")
const mongoStore = require('express-session-mongo');

const getUserByEmail = async (email) => {
  return await UsersModel.findOne({email: email});
}

const getUserById = async (id) => {
  return await UsersModel.findById(id);
}


const app = express()

// middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())


// connect to mongoDB
mongoose.connect(process.env.DB)

initialize(passport, getUserByEmail, getUserById)

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } 

  res.status(401).json({msg: "Must be authenticated"});
}

const checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.json({msg: "Can't access, authenticated"});
  } 

  return next();
}

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
// -----   HOUSES ROUTES   ----- //
// ---------------------------- //

app.get("/houses", async (req, res) => {
  try {
    let query = await HouseModel.find()
    res.json(query)
  } catch (e) {
    res.json(e)
  }
})

app.get("/houses/:id", async (req, res) => {
  try {
    let query = await HouseModel.findById({ id: req.params.id })
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

app.delete("/houses/:id", async (req, res) => {
  const {id} = req.params
  const houseToDelete = await HouseModel.findById(id);
  if (req.body.passphrase == houseToDelete.passphrase) {
    const query = await HouseModel.findByIdAndDelete({_id: id});
    res.json({ msg: "Success"});
  } else {
    res.status(401).json({ msg: "Wrong passphrase"});
  }
})

app.post("/houses", async (req, res) => {
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
// -----   AUTH ROUTES    ----- //
// ---------------------------- //

app.delete("/logout", checkAuthenticated, (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.json({ msg: "Logged out"});
  });
});

app.post("/login", checkNotAuthenticated, passport.authenticate("local"), (req, res) => {
  res.json({msg: "Authenticated"})
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    await UsersModel.create({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email
    })
    res.json({ msg: "Registered new user"})
  } catch {
    res.json({ msg: "Error"})
  }
})


// ---------------------------- //
// -----   START SERVER   ----- //
// ---------------------------- //

app.listen(process.env.PORT, () => {
  console.log("--- Server is UP and running ---")
})

// ---------------------------- //
// ---------------------------- //