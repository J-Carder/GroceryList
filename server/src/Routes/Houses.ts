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

  app.put("/houses/:id", checkAuthenticated, async (req, res) => {
    try {
      const {id} = req.params
      const house = await HouseModel.findOne({_id: id});
      let name = house.name;
      let passphrase = house.passphrase;
      if (req.body.name) {
        name = req.body.name
      } 
      if (req.body.passphrase) {
        passphrase = req.body.passphrase
      }
      const query = await HouseModel.findByIdAndUpdate({_id: id}, {name: name, passphrase: passphrase})
      res.json({success: true})

    } catch (e) {
      res.json({msg: "Error"})
    }
  })

  app.delete("/houses/:id", checkAuthenticated, async (req, res) => {
    try {
      const {id} = req.params
      const houseToDelete = await HouseModel.findById(id);
      if (req.body.passphrase == houseToDelete.passphrase) {
        const query = await HouseModel.findByIdAndDelete({_id: id});
        res.json({ msg: "Success"});
      } else {
        res.status(401).json({ msg: "Wrong passphrase"});
      }

    } catch (e) {
      res.json({msg: "Error"})
    }
  })

  app.post("/houses", checkAuthenticated, async (req, res) => {
    try {
      await HouseModel.create({
        name: req.body.name,
        passphrase: req.body.passphrase
      })

      res.json({success: true})

    } catch (e) {
      res.json({msg: "Error"})
    }
  })
}

export default houses;