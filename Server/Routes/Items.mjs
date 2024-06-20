import ItemModel from "../Models/Item.mjs"

// ---------------------------- //
// -----   ITEM ROUTES    ----- //
// ---------------------------- //

const items = (app) => {

  app.get("/items", async (req, res) => {
    try {
      let query = await ItemModel.find()
      res.json(query)
    } catch (e) {
      res.json(e)
    }
  })

  app.get("/items/:id", async (req, res) => {
    try {
      let query = await ItemModel.findById(req.params.id)
      res.json(query)
    } catch (e) {
      res.json(e)
    }
  })

  app.put("/items/:id", async (req, res) => {
    const {id} = req.params
    const completed = req.body.completed
    const query = await ItemModel.findByIdAndUpdate({_id: id}, {completed: completed})
    res.json({success: true})
  })

  app.delete("/items/:id", async (req, res) => {
    const {id} = req.params
    const query = await ItemModel.findByIdAndDelete({_id: id})
    res.json({success: true})
  })

  app.post("/items", async (req, res) => {

    await ItemModel.create({
      item: req.body.item,
      department: req.body.department,
      wantedBy: req.body.wantedBy,
      apartOfList: req.body.apartOfList
    })

    res.json({success: true})
  })
}

export default items;