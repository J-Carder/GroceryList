import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express from "express";
import mongoose from 'mongoose';
import cors from 'cors';
import UsersModel from './Models/User.js';
import passport from "passport";
import flash from "express-flash";
import session from "express-session";
import initialize from "./Routes/Passport.js";
import cookieParser from "cookie-parser";

// route imports
import items from "./Routes/Items.js";
import departments from "./Routes/Departments.js";
import houses from "./Routes/Houses.js";
import lists from "./Routes/Lists.js";
import people from "./Routes/People.js";
import auth from "./Routes/Auth.js";
import users from "./Routes/Users.js";

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

app.use(cors({credentials: true, origin: "http://localhost:5173"}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(flash())
app.use(cookieParser())
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

  return res.status(401).json({msg: "Must be authenticated"});
  // res.cookie('connect.sid', "s%3ArkHjIgVDFifbwCCqMd6anL7dbZVqtdX8.zSsNAlWrg%2Fvfae52phpmyZKoymdNMe2b0ruwmx28V3o", { path: "/", httpOnly: true }).send();
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

items(app, checkAuthenticated, checkNotAuthenticated);
departments(app, checkAuthenticated, checkNotAuthenticated);
houses(app, checkAuthenticated, checkNotAuthenticated);
lists(app, checkAuthenticated, checkNotAuthenticated);
people(app, checkAuthenticated, checkNotAuthenticated);
auth(app, checkAuthenticated, checkNotAuthenticated, passport);
users(app, checkAuthenticated, checkNotAuthenticated);

// ---------------------------- //
// -----   START SERVER   ----- //
// ---------------------------- //

app.listen(process.env.PORT, () => {
  console.log("--- Server is UP and running ---")
})

// ---------------------------- //
// ---------------------------- //