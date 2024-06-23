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
    try {
      const {id} = req.params
      const name = req.body.name
      const query = await PeopleModel.findByIdAndUpdate({_id: id}, {name: name})
      res.json({success: true})

    } catch (e) {
      res.json({msg: "Error"})
    }
  })

  app.delete("/people/:id", checkAuthenticated, async (req, res) => {
    try {
      const {id} = req.params
      const query = await PeopleModel.findByIdAndDelete({_id: id})
      res.json({success: true})

    } catch (e) {
      res.json({msg: "Error"})
    }
  })

  app.post("/people", checkAuthenticated, async (req, res) => {
    try {
      await PeopleModel.create({
        name: req.body.name,
        apartOfHouse: req.body.apartOfHouse
      })

      res.json({success: true})

    } catch (e) {
      res.json({msg: "Error"})
    }
  })
} 

export default people;