import PeopleModel from "../Models/Person.js"

// ---------------------------- //
// -----   PEOPLE ROUTES  ----- //
// ---------------------------- //

const people = (app, checkAuthenticated, checkNotAuthenticated) => {

  // READ
  app.get("/people/:house", checkAuthenticated, async (req, res) => {
    try {
      const house = req.params.house;
      if (req.user.houses.includes(house)) {
        let query = await PeopleModel.find({apartOfHouse: house})
        res.json(query)
      } else {
        res.json([])
      }
    } catch (e) {
      res.json(e)
    }
  })

  // UPDATE probably not needed
  // app.put("/people/:id", checkAuthenticated, async (req, res) => {
  //   try {
  //     const {id} = req.params
  //     const name = req.body.name
  //     const query = await PeopleModel.findByIdAndUpdate({_id: id}, {name: name})
  //     res.json({success: true})

  //   } catch (e) {
  //     res.json({msg: "Error"})
  //   }
  // })

  // DELETE
  app.delete("/people/:id", checkAuthenticated, async (req, res) => {
    try {
      const house = req.body.house;
      if (req.user.houses.includes(house)) {
        const {id} = req.params
        if (await PeopleModel.find({_id: id, apartOfHouse: house})) {
          const query = await PeopleModel.findByIdAndDelete({_id: id})
          return res.json({msg: "Success"});
        }
      } else {
        res.json({msg: "Not authorized"})
      }
    } catch (e) {
      res.json({msg: "Error"})
    }
  })

  // CREATE
  app.post("/people", checkAuthenticated, async (req, res) => {
    try {
      const house = req.body.house;
      if (req.body.name.length < 1 || req.body.name.length > 100) return res.json({msg: "Person name must be within 1 and 100 characters"});
      if (await PeopleModel.findOne({name: req.body.name, apartOfHouse: house})) return res.json({msg: "Person already exists"})
      if (req.user.houses.includes(house)) {
        await PeopleModel.create({
          name: req.body.name,
          apartOfHouse: house
        })
        return res.json({msg: "Success"});
      } else {
        res.json({msg: "Not authorized"})
      }
    } catch (e) {
      res.json({msg: "Error"})
    }
  })
} 

export default people;