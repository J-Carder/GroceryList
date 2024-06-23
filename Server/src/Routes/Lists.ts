import ListModel from "../Models/List.js"

// ---------------------------- //
// -----   LIST ROUTES    ----- //
// ---------------------------- //

const lists = (app, checkAuthenticated, checkNotAuthenticated) => {

  app.get("/lists/:house", checkAuthenticated, async (req, res) => {
    try {

      let {house} = req.params;
      let housesApartOf = req.user.houses

      if (!housesApartOf.includes(house)) {
        return res.json([]);
      }

      let query = await ListModel.find({apartOfHouse: house})
      res.json(query)
    } catch (e) {
      res.json(e)
    }
  })

  // TODO: this
  app.put("/lists/:id", checkAuthenticated, async (req, res) => {
    try {
      const {id} = req.params
      // const name = req.body.name
      // const query = await PeopleModel.findByIdAndUpdate({_id: id}, {name: name})
      res.json({success: true})

    } catch (e) {
      res.json({msg: "Error"})
    }
  })

  app.delete("/lists/:id", checkAuthenticated, async (req, res) => {
    try {
      const {id} = req.params
      const query = await ListModel.findByIdAndDelete({_id: id})
      res.json({success: true})

    } catch (e) {
      res.json({msg: "Error"})
    }
  })

  app.post("/lists", checkAuthenticated, async (req, res) => {
    try {
      await ListModel.create({
        name: req.body.name
      })
      res.json({success: true})
    } catch (e) {
      res.json({msg: "Error"})
    }
  })
}
export default lists;