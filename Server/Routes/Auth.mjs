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

  app.post("/login", checkNotAuthenticated, passport.authenticate("local"), (req, res) => {
    res.json({
      msg: "Authenticated",
      user: pick(req.user, "name")
    })
  });

  app.post("/register", checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 15)
      await UsersModel.create({
        name: req.body.name,
        password: hashedPassword,
        email: req.body.email
      })
      res.json({ msg: "Registered new user"})
    } catch {
      res.json({ msg: "Error"})
    }
  })
}
export default auth;