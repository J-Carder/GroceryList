import ListModel from "../Models/List.mjs"

// ---------------------------- //
// -----   LIST ROUTES    ----- //
// ---------------------------- //

const lists = (app) => {

  app.get("/lists", async (req, res) => {
    try {
      let query = await ListModel.find()
      res.json(query)
    } catch (e) {
      res.json(e)
    }
  })

  // TODO: this
  app.put("/lists/:id", async (req, res) => {
    const {id} = req.params
    // const name = req.body.name
    // const query = await PeopleModel.findByIdAndUpdate({_id: id}, {name: name})
    res.json({success: true})
  })

  app.delete("/lists/:id", async (req, res) => {
    const {id} = req.params
    const query = await PeopleModel.findByIdAndDelete({_id: id})
    res.json({success: true})
  })

  app.post("/lists", async (req, res) => {

    await PeopleModel.create({
      name: req.body.name,
      apartOfHouse: req.body.apartOfHouse
    })

    res.json({success: true})
  })
}
export default lists;