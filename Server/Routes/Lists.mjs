import ListModel from "../Models/List.mjs"

// ---------------------------- //
// -----   LIST ROUTES    ----- //
// ---------------------------- //

const lists = (app, checkAuthenticated, checkNotAuthenticated) => {

  app.get("/lists", checkAuthenticated, async (req, res) => {
    try {
      let query = await ListModel.find()
      res.json(query)
    } catch (e) {
      res.json(e)
    }
  })

  // TODO: this
  app.put("/lists/:id", checkAuthenticated, async (req, res) => {
    const {id} = req.params
    // const name = req.body.name
    // const query = await PeopleModel.findByIdAndUpdate({_id: id}, {name: name})
    res.json({success: true})
  })

  app.delete("/lists/:id", checkAuthenticated, async (req, res) => {
    const {id} = req.params
    const query = await ListModel.findByIdAndDelete({_id: id})
    res.json({success: true})
  })

  app.post("/lists", checkAuthenticated, async (req, res) => {

    await ListModel.create({
      name: req.body.name
    })

    res.json({success: true})
  })
}
export default lists;