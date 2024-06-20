import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express from "express";
import mongoose from 'mongoose';
import cors from 'cors';
import UsersModel from './Models/User.mjs';
import passport from "passport";
import flash from "express-flash";
import session from "express-session";
import initialize from "./Routes/Passport.mjs";
import mongoStore from 'express-session-mongo';

// route imports
import items from "./Routes/Items.mjs";
import departments from "./Routes/Departments.mjs";
import houses from "./Routes/Houses.mjs";
import lists from "./Routes/Lists.mjs";
import auth from "./Routes/Auth.mjs";

const getUserByEmail = async (email) => {
  return await UsersModel.findOne({email: email});
}

const getUserById = async (id) => {
  return await UsersModel.findById(id);
}

// new express app
const app = express()

// ---------------------------- //
// -----     MIDDLEWARE   ----- //
// ---------------------------- //

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

// initialize passport
initialize(passport, getUserByEmail, getUserById)

// check auth/not auth
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
// -----      ROUTES      ----- //
// ---------------------------- //

items(app);
departments(app);
houses(app);
lists(app);
auth(app, checkAuthenticated, checkNotAuthenticated, passport);

// ---------------------------- //
// -----   START SERVER   ----- //
// ---------------------------- //

app.listen(process.env.PORT, () => {
  console.log("--- Server is UP and running ---")
})

// ---------------------------- //
// ---------------------------- //