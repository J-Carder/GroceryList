import UsersModel from "../Models/User.mjs";

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
}
export default auth;