import HouseModel from "../Models/House.js";
import ItemModel from "../Models/Item.js"
import ListModel from "../Models/List.js";

// ---------------------------- //
// -----   ITEM ROUTES    ----- //
// ---------------------------- //

const items = (app, checkAuthenticated, checkNotAuthenticated, io) => {


  app.post("/items/fill", checkAuthenticated, async (req, res) => {
    try {
      // query param 
      let {apartOfList} = req.body
      // the houses the user has attached to them
      let apartOfHouses = req.user.houses;
      // the house the list they are requesting is apart of
      let houseRequested = (await ListModel.findById(apartOfList)).apartOfHouse
      if (!apartOfHouses.includes(houseRequested)) {
        // if they don't have this house error
        return res.status(401).json({msg: "Not authorized"})
      }

      await ItemModel.updateMany({}, {"$set":{completed: req.body.completed}})
      io.to(houseRequested).emit("fill", req.body.completed);
      res.json({msg: "Success"})
    } catch (e) {
      console.log(e);
      res.json({msg: "Failed"});
    }
  })

  app.post("/items/clear", checkAuthenticated, async (req, res) => {
    try {
      // query param 
      let {apartOfList} = req.body
      // the houses the user has attached to them
      let apartOfHouses = req.user.houses;
      // the house the list they are requesting is apart of
      let houseRequested = (await ListModel.findById(apartOfList)).apartOfHouse
      if (!apartOfHouses.includes(houseRequested)) {
        // if they don't have this house error
        return res.status(401).json({msg: "Not authorized"})
      }
      
      console.log("MODEL= ", await ItemModel.find());
      await ItemModel.deleteMany({completed: true})

      // MAKE ROOM
      io.to(houseRequested).emit("clear", "null")

      res.json({msg: "Success"})
    } catch (e) {
      console.log(e);
      res.json({msg: "Failed"});
    }

  })

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

  // app.get("/items/:id", checkAuthenticated, async (req, res) => {
  //   try {
  //     let query = await ItemModel.findById(req.params.id)
  //     res.json(query)
  //   } catch (e) {
  //     res.json(e)
  //   }
  // })

  app.put("/items/:id", checkAuthenticated, async (req, res) => {
    try {
      // query param 
      let {apartOfList} = req.body
      // the houses the user has attached to them
      let apartOfHouses = req.user.houses;
      // the house the list they are requesting is apart of
      let houseRequested = (await ListModel.findById(apartOfList)).apartOfHouse
      if (!apartOfHouses.includes(houseRequested)) {
        // if they don't have this house error
        return res.status(401).json({msg: "Not authorized"})
      }

      const {id} = req.params
      const completed = req.body.completed
      if (await ItemModel.findById(id)) {
        await ItemModel.findByIdAndUpdate({_id: id}, {completed: completed})
      } else {
        await ItemModel.updateOne({tempId: req.body.tempId}, {completed: completed})
      }

      io.to(houseRequested).emit("update", {id: id, completed: completed})
      res.json({msg: "Success"})
    } catch (e) {
      console.log(e);
      res.json({msg: "Failed"});
    }
  })

  app.delete("/items/:id", checkAuthenticated, async (req, res) => {
    try {
      // query param 
      let {apartOfList} = req.body
      // the houses the user has attached to them
      let apartOfHouses = req.user.houses;
      // the house the list they are requesting is apart of
      let houseRequested = (await ListModel.findById(apartOfList)).apartOfHouse
      if (!apartOfHouses.includes(houseRequested)) {
        // if they don't have this house error
        return res.status(401).json({msg: "Not authorized"})
      }

      const {id} = req.params
      console.log("temp id=> " + req.body.tempId);
      const query = await ItemModel.findByIdAndDelete({_id: id})
      // for deleting of items that weren't assigned a proper ID yet (ie. offline)
      const query2 = await ItemModel.deleteOne({tempId: req.body.tempId})

      // MAKE ROOM
      io.to(houseRequested).emit("delete", id)
      res.json({msg: "Success"})
    } catch (e) {http://localhost:5173/
      console.log(e);
      res.json({msg: "Failed"});
    }
  })

  app.post("/items/:apartOfList", checkAuthenticated, async (req, res) => {

    try {
      // query param 
      let { apartOfList } = req.params;
      // the houses the user has attached to them
      let apartOfHouses = req.user.houses;
      let houseRequested;

      try {
        // the house the list they are requesting is apart of
        houseRequested = (await ListModel.findById(req.body.apartOfList)).apartOfHouse
      } catch (e) {
        // if above fails, they might've created it offline so search the tempId
        houseRequested = ((await ListModel.findOne({tempId: req.body.apartOfList})).apartOfHouse)
      }
      if (!apartOfHouses.includes(houseRequested)) {
        // if they don't have this house error
        return res.status(401).json({msg: "Not authorized"});
      }

      let tempId = null;
      if (req.body.tempId) {
        tempId = req.body.tempId
      }
      const tempApartOfList = req.body.tempApartOfList;
      const tempList = await ListModel.findOne({tempId: tempApartOfList});

      const item = await ItemModel.create({
        item: req.body.item,
        department: req.body.department,
        wantedBy: req.body.wantedBy,
        apartOfList: tempList._id, 
        originalTimeCreated: req.body.originalTimeCreated,
        tempId: tempId,
        tempApartOfList: tempApartOfList
      });

      console.log(`item added to house: ${houseRequested}`)
      io.to(houseRequested).emit("add", item)
      // io.to(houseRequested).emit("message", item)
      res.json({msg: "Success"})
    } catch (e) {
      console.log(e);
      res.json({msg: "Failed"});
    }
  })
}

export default items;