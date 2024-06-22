import PeopleModel from "../Models/Person.js"

// ---------------------------- //
// -----   PEOPLE ROUTES  ----- //
// ---------------------------- //

const people = (app, checkAuthenticated, checkNotAuthenticated) => {

  app.get("/people", checkAuthenticated, async (req, res) => {
    try {
      let query = await PeopleModel.find()
      res.json(query)
    } catch (e) {
      res.json(e)
    }
  })

  // probably not needed
  app.put("/people/:id", checkAuthenticated, async (req, res) => {
    const {id} = req.params
    const name = req.body.name
    const query = await PeopleModel.findByIdAndUpdate({_id: id}, {name: name})
    res.json({success: true})
  })

  app.delete("/people/:id", checkAuthenticated, async (req, res) => {
    const {id} = req.params
    const query = await PeopleModel.findByIdAndDelete({_id: id})
    res.json({success: true})
  })

  app.post("/people", checkAuthenticated, async (req, res) => {

    await PeopleModel.create({
      name: req.body.name,
      apartOfHouse: req.body.apartOfHouse
    })

    res.json({success: true})
  })
} 

export default people;