import UsersModel from "../Models/User.js"

// ---------------------------- //
// -----   USER ROUTES    ----- //
// ---------------------------- //

const users = (app, checkAuthenticated, checkNotAuthenticated) => {

  app.delete("/users/house", checkAuthenticated, async (req, res) => {
    const userEmail = req.user.email;
    const query = await UsersModel.findOneAndUpdate({email: userEmail}, {houses: []})
    res.json({success: true})
  })
} 

export default users;