import UsersModel from "../Models/User.mjs";
import bcrypt from "bcrypt";
import { omit, pick } from "../helpers.mjs";

// ---------------------------- //
// -----   AUTH ROUTES    ----- //
// ---------------------------- //

const auth = (app, checkAuthenticated, checkNotAuthenticated, passport) => {

  app.delete("/logout", checkAuthenticated, (req, res) => {
    req.logout((err) => {
      if (err) { return next(err); }
      res.json({ msg: "Logged out"});
    });
  });

  // BAD ROUTE - cookie SHOULD be attached 
  app.post("/login", checkNotAuthenticated, passport.authenticate("local"), (req, res) => {
    res.json({
      msg: "Authenticated",
      user: req.user
    })
  });

  app.post("/register", checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 15);
      console.log(req.body.name, hashedPassword, req.body.email)
      await UsersModel.create({
        name: req.body.name,
        password: hashedPassword,
        email: req.body.email
      })
      res.json({ msg: "Registered new user"})
    } catch (e) {
      res.json({ msg: e})
    }
  })
}
export default auth;