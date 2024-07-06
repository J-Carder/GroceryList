import UsersModel from "../Models/User.js";
import bcrypt from "bcrypt";
import { omit, pick } from "../helpers.js";

// ---------------------------- //
// -----   AUTH ROUTES    ----- //
// ---------------------------- //

const auth = function(app, checkAuthenticated, checkNotAuthenticated, passport, io)  {

  app.delete("/logout", (req, res, next) => {
    try {

      app.socket.leave(req.user.houses[0])
      req.session.destroy((err) => {
        if (err) { return next(err); }
        res.clearCookie('connect.sid');

        res.json({ msg: "Logged out" })
      })
      // req.logout((err) => {
      //   if (err) { return next(err); }
      //   res.json({ msg: "Logged out"});
      // });
    } catch (e) {
      res.json({msg: "Error"})
    }
  });

  app.post("/login", checkNotAuthenticated, passport.authenticate("local"), (req, res) => {
    try {

      // SOCKETIO JOIN ROOM

      if (req.user.houses.length > 0) {
        console.log(req.user.houses[0]);
        app.socket.join(req.user.houses[0])
      }

      res.json({
        msg: "Authenticated",
        user: pick(req.user, "name", "email", "houses", "admin")
      })
    } catch (e) {
      res.json({msg: "Error"})
    }
  });

  app.post("/register", checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const email = req.body.email.toLowerCase();
      await UsersModel.create({
        name: req.body.name,
        password: hashedPassword,
        email: email
      })
      res.json({ msg: "Registered new user"})
    } catch (e) {
      res.json({ msg: e})
    }
  })

  app.get("/authenticated", checkAuthenticated, async function (req, res) {
    try {
      console.log("authed");

      // // SOCKETIO JOIN ROOM
      if (req.user.houses.length > 0) {
        app.socket.join(req.user.houses[0])
      }

      res.json({ msg: "Authenticated", user: pick(req.user, "name", "email", "houses", "admin")});
    } catch (e) {
      res.json({msg: "Error"})
    }
  })
}
export default auth;