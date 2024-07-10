import UsersModel from "../Models/User.js";
import bcrypt from "bcrypt";
import { omit, pick } from "../helpers.js";

// ---------------------------- //
// -----   AUTH ROUTES    ----- //
// ---------------------------- //

const auth = function(app, checkAuthenticated, checkNotAuthenticated, passport, io)  {

  app.delete("/logout", (req, res, next) => {
    try {

      if (app.socket) {
        app.socket.leave(req.user.houses[0])
      }
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
      if (req.user.houses.length > 0 && app.socket) {
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
      if (req.body.password.length < 4) return res.json({ msg: "Password to short (must be 6 or more characters)"})
      if (req.body.password.length > 50) return res.json({ msg: "Password to long (over 50 characters)"})
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const email = req.body.email.toLowerCase();
      const name = req.body.name;

      const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

      if (!emailRegex.test(email)) return res.json({ msg: "Invalid email"});
      console.log(emailRegex.test(email));
      if (name.length < 1 || name.length > 50) return res.json({msg: "Invalid name"});
      if (await UsersModel.findOne({email: email})) return res.json({ msg: "Email already in use"});

      await UsersModel.create({
        name: name,
        password: hashedPassword,
        email: email
      })
      res.json({ msg: "Registered new user"})
    } catch (e) {
      console.log(e)
      res.json({ msg: "Error"})
    }
  })

  app.get("/authenticated", checkAuthenticated, async function (req, res) {
    try {
      console.log("authed");

      // // SOCKETIO JOIN ROOM
      if (req.user.houses.length > 0 && app.socket) {
        app.socket.join(req.user.houses[0])
      }

      res.json({ msg: "Authenticated", user: pick(req.user, "name", "email", "houses", "admin")});
    } catch (e) {
      res.json({msg: "Error"})
    }
  })
}
export default auth;