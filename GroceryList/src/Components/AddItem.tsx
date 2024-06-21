import React, { useEffect, useState, useContext } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Context } from '../App'



function AddItem({setPage}) {

  const queryClient = useQueryClient()
  const [item, setItem] = useState("");
  const {personSelected, personList, departmentSelected, departmentList} = useContext(Context);

  const [personSelectedVal, setPersonSelectedVal] = personSelected;
  const [personListVal, setPersonListVal] = personList;

  const [departmentSelectedVal, setDepartmentSelectedVal] = departmentSelected;
  const [departmentListVal, setDepartmentListVal] = departmentList;


  const fetchGetDepts = async () => {
    const req = await fetch("http://localhost:3001/departments")
    return req.json();
  }

  const fetchGetPeople = async () => {
    const req = await fetch("http://localhost:3001/people")
    return req.json();
  }

  const fetchAddQuery = async () => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/items`, {
            method: 'post',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              item: item,
              wantedBy: personSelectedVal,
              department: departmentSelectedVal
            })
          });
      return req.json();
  }

  const deptQuery = useQuery({
    queryFn: fetchGetDepts,
    queryKey: ["deptGetQuery"]
  })

  const peopleQuery = useQuery({
    queryFn: fetchGetPeople,
    queryKey: ["peopleGetQuery"]
  })

  const addItemQuery = useMutation({
    mutationFn: fetchAddQuery,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getQuery"]})
    }
  })

  const handleAdd = async () => {
    if (item != "") {
      addItemQuery.mutate(); 
      setItem("")
    } else {
      // TODO: send error cuz of blank string
    }
  }

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      handleAdd();
      setItem("")
    }
  }

  const handlePersonChange = (person) => {
    setPersonSelectedVal(person);
  }

  const handleDepartmentChange = (dept) => {
    setDepartmentSelectedVal(dept);
  }

  useEffect(() => {
    peopleQuery.isSuccess && setPersonListVal(peopleQuery.data);
    deptQuery.isSuccess && setDepartmentListVal(deptQuery.data);

    try {
      peopleQuery.isSuccess && setPersonSelectedVal(peopleQuery.data[0].name)
    } catch (e) {
      setPersonSelectedVal("")
    }

    try {
      deptQuery.isSuccess &&setDepartmentSelectedVal(deptQuery.data[0].department)
    } catch (e) {
      setDepartmentSelectedVal("")
    }

  }, [peopleQuery.data, deptQuery.data]);

  return (
    <div>
      <input type="text" value={item} onChange={(e) => setItem(e.target.value)} onKeyDown={handleKeyDown} />
      <button onClick={handleAdd}>Add</button>

      <div className="categories">
        <h3>Wanted by:</h3>
        <select name="wantedBy" id="wantedBy" value={personSelectedVal} onChange={e => handlePersonChange(e.target.value)}>
          { peopleQuery.isSuccess && personListVal.map(person => <option key={person._id}>{person.name}</option>)  } 
        </select>
        <h3>Department</h3>
        <select name="dept" id="dept" value={departmentSelectedVal} onChange={e => handleDepartmentChange(e.target.value)}>
          { deptQuery.isSuccess && departmentListVal.map(dept => <option key={dept._id}>{dept.department}</option>) } 
        </select>
      </div>
    </div>
  )
}

export default AddItem