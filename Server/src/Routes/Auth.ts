import UsersModel from "../Models/User.js";
import bcrypt from "bcrypt";
import { omit, pick } from "../helpers.js";

// ---------------------------- //
// -----   AUTH ROUTES    ----- //
// ---------------------------- //

const auth = (app, checkAuthenticated, checkNotAuthenticated, passport) => {

  app.delete("/logout", checkAuthenticated, (req, res, next) => {
    req.logout((err) => {
      if (err) { return next(err); }
      res.json({ msg: "Logged out"});
    });
  });

  // BAD ROUTE - cookie SHOULD be attached 
  app.post("/login", checkNotAuthenticated, passport.authenticate("local"), (req, res) => {
    res.json({
      msg: "Authenticated",
      user: pick(req.user, "name", "email", "houses", "admin")
    })
  });

  app.post("/register", checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 15);
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

  app.get("/authenticated", checkAuthenticated, async (req, res) => {
    res.json({ msg: "Authenticated", user: pick(req.user, "name", "email", "houses", "admin")});
  })
}
export default auth;