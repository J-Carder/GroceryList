import HouseModel from "../Models/House.js"

// ---------------------------- //
// -----   HOUSES ROUTES   ----- //
// ---------------------------- //

const houses = (app, checkAuthenticated, checkNotAuthenticated) => {

  app.get("/houses", checkAuthenticated, async (req, res) => {
    try {
      let query = await HouseModel.find()
      res.json(query)
    } catch (e) {
      res.json(e)
    }
  })

  app.get("/houses/:id", checkAuthenticated, async (req, res) => {
    try {
      let query = await HouseModel.findById({ id: req.params.id })
      res.json(query)
    } catch (e) {
      res.json(e)
    }
  })

  // TODO: this
  app.put("/houses/:id", checkAuthenticated, async (req, res) => {
    const {id} = req.params
    // const name = req.body.name
    // const query = await HouseModel.findByIdAndUpdate({_id: id}, {name: name})
    res.json({success: true})
  })

  app.delete("/houses/:id", checkAuthenticated, async (req, res) => {
    const {id} = req.params
    const houseToDelete = await HouseModel.findById(id);
    if (req.body.passphrase == houseToDelete.passphrase) {
      const query = await HouseModel.findByIdAndDelete({_id: id});
      res.json({ msg: "Success"});
    } else {
      res.status(401).json({ msg: "Wrong passphrase"});
    }
  })

  app.post("/houses", checkAuthenticated, async (req, res) => {
    await HouseModel.create({
      name: req.body.name,
      passphrase: req.body.passphrase
    })

    res.json({success: true})
  })
}

export default houses;