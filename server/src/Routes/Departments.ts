import DepartmentModel from "../Models/Department.js"

// ---------------------------- //
// -----   DEPTS ROUTES   ----- //
// ---------------------------- //

const departments = (app, checkAuthenticated, checkNotAuthenticated) => {

  app.get("/departments/:house", checkAuthenticated, async (req, res) => {
    try {
      const house = req.params.house;
      if (house.length < 1) res.json({ msg: "Invalid house"})
      if (req.user.houses.includes(house)) {
        let query = await DepartmentModel.find({apartOfHouse: house})
        res.json(query)
      } else {
        res.json([])
      }
    } catch (e) {
      res.json(e)
    }
  })

  // probably not needed
  // app.put("/departments/:id", checkAuthenticated, async (req, res) => {
  //   try {
  //     const {id} = req.params
  //     const department = req.body.department
  //     const query = await DepartmentModel.findByIdAndUpdate({_id: id}, {department: department})
  //     res.json({success: true})

  //   } catch(e) {
  //     res.json({msg: "Error"})
  //   }
  // })

  app.delete("/departments/:id", checkAuthenticated, async (req, res) => {
    try {
      const house = req.body.house;
      if (req.user.houses.includes(house)) {
        const {id} = req.params
        if (await DepartmentModel.find({_id: id, apartOfHouse: house})) {
          const query = await DepartmentModel.findByIdAndDelete({_id: id})
          return res.json({msg: "Success"});
        }
      } else {
        res.json({msg: "Not authorized"})
      }
    } catch (e) {
      res.json({msg: "Error"})
    }
  })

  app.post("/departments", checkAuthenticated, async (req, res) => {
    try {
      const house = req.body.house;
      const dept = req.body.department;
      if (dept.length < 1 || dept.length > 50) return res.json({msg: "Invalid house name too long or short"})
      
      if (await DepartmentModel.findOne({ department: dept, apartOfHouse: house })) return res.json({msg: "Department already exists"})

      if (req.user.houses.includes(house)) {
        await DepartmentModel.create({
          department: dept,
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

export default departments;