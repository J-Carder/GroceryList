import DepartmentModel from "../Models/Department.js"

// ---------------------------- //
// -----   DEPTS ROUTES   ----- //
// ---------------------------- //

const departments = (app, checkAuthenticated, checkNotAuthenticated) => {

  app.get("/departments", checkAuthenticated, async (req, res) => {
    try {
      let query = await DepartmentModel.find()
      res.json(query)
    } catch (e) {
      res.json(e)
    }
  })

  // probably not needed
  app.put("/departments/:id", checkAuthenticated, async (req, res) => {
    const {id} = req.params
    const department = req.body.department
    const query = await DepartmentModel.findByIdAndUpdate({_id: id}, {department: department})
    res.json({success: true})
  })

  app.delete("/departments/:id", checkAuthenticated, async (req, res) => {
    const {id} = req.params
    const query = await DepartmentModel.findByIdAndDelete({_id: id})
    res.json({success: true})
  })

  app.post("/departments", checkAuthenticated, async (req, res) => {

    await DepartmentModel.create({
      department: req.body.department,
      apartOfHouse: req.body.apartOfHouse
    })

    res.json({success: true})
  })
}

export default departments;