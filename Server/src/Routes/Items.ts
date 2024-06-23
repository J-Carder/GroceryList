import HouseModel from "../Models/House.js";
import ItemModel from "../Models/Item.js"
import ListModel from "../Models/List.js";

// ---------------------------- //
// -----   ITEM ROUTES    ----- //
// ---------------------------- //

const items = (app, checkAuthenticated, checkNotAuthenticated) => {

  app.get("/items/:apartOfList", checkAuthenticated, async (req, res) => {
    try {
      // query param 
      let {apartOfList} = req.params
      // the houses the user has attached to them
      let apartOfHouses = req.user.houses;
      // the house the list they are requesting is apart of
      let houseRequested = (await ListModel.findById(apartOfList)).apartOfHouse
      if (!apartOfHouses.includes(houseRequested)) {
        // if they don't have this house error
        return res.status(401).json({msg: "Not authorized 1"})
      }

      let query = await ItemModel.find({apartOfList: apartOfList })
      res.json(query)
    } catch (e) {
      console.log(e);
      res.json([])
    }
  })

  app.get("/items/:id", checkAuthenticated, async (req, res) => {
    try {
      let query = await ItemModel.findById(req.params.id)
      res.json(query)
    } catch (e) {
      res.json(e)
    }
  })

  app.put("/items/:id", checkAuthenticated, async (req, res) => {
    try {
      const {id} = req.params
      const completed = req.body.completed
      const query = await ItemModel.findByIdAndUpdate({_id: id}, {completed: completed})
      res.json({success: true})

    } catch (e) {
      res.json({msg: "Error"})
    }
  })

  app.delete("/items/:id", checkAuthenticated, async (req, res) => {
    try {
      const {id} = req.params
      const query = await ItemModel.findByIdAndDelete({_id: id})
      res.json({success: true})

    } catch (e) {
      res.json({msg: "Error"})
    }
  })

  app.post("/items", checkAuthenticated, async (req, res) => {
    try {
    await ItemModel.create({
      item: req.body.item,
      department: req.body.department,
      wantedBy: req.body.wantedBy,
      apartOfList: req.body.apartOfList
    })

    res.json({success: true})

    } catch (e) {
      res.json({msg: "Error"})
    }
  })
}

export default items;