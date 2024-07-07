import ListModel from "../Models/List.js"

// ---------------------------- //
// -----   LIST ROUTES    ----- //
// ---------------------------- //

const lists = (app, checkAuthenticated, checkNotAuthenticated) => {

  app.get("/lists/:house", checkAuthenticated, async (req, res) => {
    try {

      let {house} = req.params;
      let housesApartOf = req.user.houses;

      if (!housesApartOf.includes(house)) {
        return res.json([]);
      }

      let query = await ListModel.find({apartOfHouse: house})
      res.json(query)
    } catch (e) {
      res.json({msg: "Error"})
    }
  })

  // app.put("/lists/:id", checkAuthenticated, async (req, res) => {
  //   try {
  //     const {id} = req.params
  //     // const name = req.body.name
  //     // const query = await PeopleModel.findByIdAndUpdate({_id: id}, {name: name})
  //     res.json({success: true})

  //   } catch (e) {
  //     res.json({msg: "Error"})
  //   }
  // })

  app.delete("/lists/:id", checkAuthenticated, async (req, res) => {
    try {


      const {id} = req.params

      const housesApartOf = req.user.houses;
      const houseListApartOf = (await ListModel.findById(id)).apartOfHouse

      if (!housesApartOf.includes(houseListApartOf)) return res.json({msg: "Not authorized"})

      const query = await ListModel.findByIdAndDelete({_id: id})
      if (req.body.tempId) {
        const query2 = await ListModel.deleteOne({tempId: req.body.tempId})
      }
      res.json({msg: "Deleted list successfully"})

    } catch (e) {
      res.json({msg: "Error"})
    }
  })

  app.post("/lists/:house", checkAuthenticated, async (req, res) => {
    try {

      let {house} = req.params;
      let housesApartOf = req.user.houses

      if (req.body.name.length < 1 || req.body.name.length > 100) return res.json({msg: "List name must be between 1 and 100 characters"})

      if (!housesApartOf.includes(house)) {
        return res.json({msg: "Not authorized"});
      }

      if ((await ListModel.find({apartOfHouse: house, name: req.body.name})).length > 0) {
        return res.json({msg: "Duplicate"})
      }

      if (req.body.tempId) {
        await ListModel.create({
          name: req.body.name,
          apartOfHouse: house,
          tempId: req.body.tempId
        })
      } else {
        await ListModel.create({
          name: req.body.name,
          apartOfHouse: house
        })
      }

      res.json({msg: "Added new list"});
    } catch (e) {
      res.json({msg: "Error"});
    }
  })
}
export default lists;