import DepartmentModel from "../Models/Department.mjs"

// ---------------------------- //
// -----   DEPTS ROUTES   ----- //
// ---------------------------- //

const departments = (app) => {

  app.get("/departments", async (req, res) => {
    try {
      let query = await DepartmentModel.find()
      res.json(query)
    } catch (e) {
      res.json(e)
    }
  })

  // probably not needed
  app.put("/departments/:id", async (req, res) => {
    const {id} = req.params
    const department = req.body.department
    const query = await DepartmentModel.findByIdAndUpdate({_id: id}, {department: department})
    res.json({success: true})
  })

  app.delete("/departments/:id", async (req, res) => {
    const {id} = req.params
    const query = await DepartmentModel.findByIdAndDelete({_id: id})
    res.json({success: true})
  })

  app.post("/departments", async (req, res) => {

    await DepartmentModel.create({
      department: req.body.department,
      apartOfHouse: req.body.apartOfHouse
    })

    res.json({success: true})
  })

  // ---------------------------- //
  // -----   PEOPLE ROUTES  ----- //
  // ---------------------------- //

  app.get("/people", async (req, res) => {
    try {
      let query = await PeopleModel.find()
      res.json(query)
    } catch (e) {
      res.json(e)
    }
  })

  // probably not needed
  app.put("/people/:id", async (req, res) => {
    const {id} = req.params
    const name = req.body.name
    const query = await PeopleModel.findByIdAndUpdate({_id: id}, {name: name})
    res.json({success: true})
  })

  app.delete("/people/:id", async (req, res) => {
    const {id} = req.params
    const query = await PeopleModel.findByIdAndDelete({_id: id})
    res.json({success: true})
  })

  app.post("/people", async (req, res) => {

    await PeopleModel.create({
      name: req.body.name,
      apartOfHouse: apartOfHouse
    })

    res.json({success: true})
  })
}

export default departments;