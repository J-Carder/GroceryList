import { get } from "http";
import HouseModel from "../Models/House.js";
import UsersModel from "../Models/User.js";
import bcrypt from "bcrypt";

// ---------------------------- //
// -----   USER ROUTES    ----- //
// ---------------------------- //

const users = (app, checkAuthenticated, checkNotAuthenticated) => {

  app.delete("/users/house", checkAuthenticated, async (req, res) => {
    try {
      const userEmail = req.user.email;
      const query = await UsersModel.findOneAndUpdate({email: userEmail}, {houses: []})
      res.json({success: true})
    } catch (e) {
      res.json({msg: "Error"})
    }
  })

  app.post("/users/house/:name", checkAuthenticated, async (req, res) => {
    try {

      const passphrase = req.body.passphrase;
      const getHouse = await HouseModel.findOne({name: req.params.name});

      if (passphrase == getHouse.passphrase) {
        await UsersModel.findOneAndUpdate({email: req.user.email}, {houses: [req.params.name]})
      } else {
        return res.json({msg: "Wrong passphrase"})
      }
      res.json({msg: "Joined"})
    } catch (e) {
      res.json({msg: "Error"})
    }
  })

  app.post("/users/name", checkAuthenticated, async (req, res) => {
    try {
      await UsersModel.findOneAndUpdate({email: req.user.email}, {name: req.body.name})
      res.json({msg: "Name changed"});
    } catch (e) {
      res.json({msg: "Error"});
    }
  })

  app.post("/users/email", checkAuthenticated, async (req, res) => {
    try {
      // make sure doesn't already have an account
      if (await UsersModel.findOne({email: req.body.newEmail.toLowerCase()})) {
        return res.json({msg: "Email already exists"})
      }
      // set new email
      await UsersModel.findOneAndUpdate({email: req.user.email}, {email: req.body.newEmail.toLowerCase()});
      res.json({msg: "Email changed"});
    } catch (e) {
      res.json({msg: "Error"});
    }
  })

  app.post("/users/password", checkAuthenticated, async (req, res) => {
    try {

      if (await bcrypt.compare(req.body.oldPassword, req.user.password)) {
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 15);
        await UsersModel.findOneAndUpdate({email: req.user.email}, {password: hashedPassword});

        res.json({msg: "Password changed"})
      } else {
        return res.json({msg: "Incorrect password"});
      }
    } catch (e) {
      res.json({msg: "Error"});
    }
  })

  app.post("/users/adminPassword", checkAuthenticated, async (req, res) => {
    try {
      if (req.user.admin) {
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 15);
        await UsersModel.findOneAndUpdate({email: req.body.email}, {password: hashedPassword});
        res.json({msg: "Password changed"})
      } else {
        res.json({msg: "Error, not authorized"})
      }
    } catch (e) {
      res.json({msg: "Error"});
    }
  })
} 

export default users;