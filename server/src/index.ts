import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express from "express";
import mongoose from 'mongoose';
import cors from 'cors';
import UsersModel from './Models/User.js';
import passport from "passport";
import session from "express-session";
import initialize from "./Routes/Passport.js";
import cookieParser from "cookie-parser";
import MongoStore from 'connect-mongo';
import fs from "fs";
import https from "https";
import http from "http";
import path, {dirname} from "path";
import { fileURLToPath } from 'url';
import ExpressMongoSanitize from "express-mongo-sanitize";
import { WebSocketServer } from "ws";
import { Server as sioServer } from "socket.io"


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

// -------------------------------- //
// -----     START SERVER     ----- //
// -------------------------------- //

const server = app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`--- Server is running on port ${process.env.PORT} ---`)
});

// -------------------------------- //
// -----   SOCKET.IO SERVER   ----- //
// -------------------------------- //

const io = new sioServer(server, {
  cors: { origin: "*"}
});

io.on("connection", socket => {
  console.log("user connected");

  socket.on("message", (message) => {
    console.log(message);
    io.emit("message", `user sent: ${message}`)
  })
})

// ---------------------------- //
// -----     MIDDLEWARE   ----- //
// ---------------------------- //

const jsonParserMiddleware = async(req, res, next) => {
  if (!req.body || typeof req.body !== 'string') {
    next();
    return;
  }
  try {
    req.body = JSON.parse(req.body);
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Malformed body (not JSON)' });
  }
};

// connect to mongoDB
const conn = mongoose.connect(process.env.DB).then(m => m.connection.getClient())

app.use(jsonParserMiddleware);
app.use(cors({credentials: true, origin: ["http://localhost:4173", "http://localhost:5173", "https://localhost:4433", "http://192.168.1.253:5173", "http://192.168.1.247:5173", "https://grocerylist-1.onrender.com/"]}));
// app.use(cors({credentials: true, origin: "http://localhost:4173"}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
// app.use(cookieSession({
//   name: "session",
//   keys: ["secret", "test"],
//   sameSite: "none"
// }))
// USE BELOW IN PROD (STORES SESSIONS IN DB)!!!!!!!
app.use(session({ // PROD
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    // sameSite: "none",
    // secure: true
  },
  store: MongoStore.create({
    clientPromise: conn,
    dbName: "GroceryList",
    stringify: false,
    autoRemove: "interval",
    autoRemoveInterval: 1
  }),
}))
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false
// }))
app.use(passport.initialize())
app.use(passport.session())
app.use(ExpressMongoSanitize())

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

io.on("connection", socket => {
  app.socket = socket;
  items(app, checkAuthenticated, checkNotAuthenticated, io);
  departments(app, checkAuthenticated, checkNotAuthenticated);
  houses(app, checkAuthenticated, checkNotAuthenticated);
  lists(app, checkAuthenticated, checkNotAuthenticated);
  people(app, checkAuthenticated, checkNotAuthenticated);
  auth(app, checkAuthenticated, checkNotAuthenticated, passport, io);
  users(app, checkAuthenticated, checkNotAuthenticated, io);

  // app.get("/socket", (req, res) => {
  //   console.log(app.socket.rooms)
  //   res.json({
  //     test: app.socket.rooms
  //   });
  // })


});

// test route
app.get("/test", (req, res) => {
  res.send({msg: "Test success"})
})


// ---------------------------- //
// ---------------------------- //