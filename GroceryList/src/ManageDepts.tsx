import React, { useContext, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Context } from './App';


const fetchGetQuery = async () => {
  const req = await fetch("http://localhost:3001/departments")
  return req.json();
}

const fetchAddQuery = async (newDept : string) => {
  if (newDept != "") {
    const req = await fetch("http://localhost:3001/departments", {
            method: 'post',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ department: newDept })
          });
      return req.json();
  } 
}

const fetchUpdateQuery = async (id : string, newDept : string) => {
  const req = await fetch(`http://localhost:3001/departments/${id}`, {
          method: 'put',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ department: newDept })
        });
    return req.json();
}

const fetchDeleteQuery = async (id : string) => {
  const req = await fetch(`http://localhost:3001/departments/${id}`, {
          method: 'delete',
          headers: {
            "Content-Type": "application/json",
          },
        });
    return req.json();
}

function ManageDepts() {

  const queryClient = useQueryClient()
  const [deptText, setDeptText] = useState("");

  const {departmentSelected, departmentList} = useContext(Context);

  const [departmentSelectedVal, setDepartmentSelectedVal] = departmentSelected;
  const [departmentListVal, setDepartmentListVal] = departmentSelected;

  const {data: depts, status: deptStatus} = useQuery({
    queryFn: fetchGetQuery,
    queryKey: ["deptGetQuery"]
  })

  const addMutation = useMutation({
    mutationFn: fetchAddQuery,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["deptGetQuery"]})
    }
  })

  const updateMutation = useMutation({
    mutationFn: fetchUpdateQuery,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["deptGetQuery"]})
    }
  })

  const deleteMutation = useMutation({
    mutationFn: fetchDeleteQuery,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["deptGetQuery"]})
    }
  })

  const handleAdd = () => {
    addMutation.mutate(deptText);
    setDepartmentSelectedVal(deptText);
    setDeptText("");
  }

  const handleDelete = (id : string) => {
    deleteMutation.mutate(id);
    try {
      setDepartmentSelectedVal(departmentList[0])
    } catch {
      setDepartmentSelectedVal("")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      handleAdd();
      setDeptText("");
    }
  }

  if (deptStatus === "pending") {
    return <h1>loading</h1>
  }

  if (deptStatus === "error") {
    return <h1>error!</h1>
  }

  return (
    <div>
      <input type="text" value={deptText} onChange={(e) => setDeptText(e.target.value)} onKeyDown={handleKeyDown}/>
      <button onClick={handleAdd}>Add</button>
      {
        depts.length === 0 ? 
        <div><h2>Empty!</h2></div>
        :
        depts.map(dept => 
          <div key={dept._id}>
            <p>{dept.department}</p> 
            <button onClick={() => handleDelete(dept._id)}>X</button>
          </div> 
        )
      }

    </div>
  )
}

export default ManageDepts