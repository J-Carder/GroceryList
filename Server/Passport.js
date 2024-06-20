const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const initialize = async (passport, getUserByEmail, getUserById) => {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email);
    if (user == null) {
      return done(null, false, {msg: "No user with that email"})
    }

    try {
      console.log(`pass: ${password}, hash: ${user.password}`)
      if (await bcrypt.compare(password, user.password)) {
        console.log(user)
        return done(null, user);
      } else {
        return done(null, false, {msg: "Password incorrect"})
      }
    } catch (e) {
      return done(e)
    }
  }
  passport.use(new LocalStrategy({ usernameField: "email"}, authenticateUser))
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => done(null, await getUserById(id)));
}

module.exports = initialize