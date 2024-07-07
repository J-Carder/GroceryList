import React, { useContext, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Context } from '../AppWrapper';
import InputText from "./InputText";
import Button from "./Button";
import XButtonText from "./XButtonText";

function ManageDepts() {

  const queryClient = useQueryClient()
  const [deptText, setDeptText] = useState("");

  const {departmentSelected, departmentList, selectedHouse} = useContext(Context);

  const [departmentSelectedVal, setDepartmentSelectedVal] = departmentSelected;
  const [departmentListVal, setDepartmentListVal] = departmentSelected;
  const [selectedHouseVal, setSelectedHouseVal] = selectedHouse;
  
  const fetchGetQuery = async () => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/departments/${selectedHouseVal}`, {
      credentials: "include"
    })
    return req.json();
  }

  const {data: depts, status: deptStatus} = useQuery({
    queryFn: fetchGetQuery,
    queryKey: ["deptGetQuery"],
    staleTime: Infinity,
    gcTime: Infinity
  })



const fetchAddQuery = async (newDept : string) => {
  if (newDept != "") {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/departments`, {
            method: 'post',
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ department: newDept, house: selectedHouseVal })
          });
      return req.json();
  } 
}

const fetchUpdateQuery = async ({id, newDept}) => {
  const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/departments/${id}`, {
          method: 'put',
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ department: newDept })
        });
    return req.json();
}

const fetchDeleteQuery = async (id : string) => {
  const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/departments/${id}`, {
          method: 'delete',
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            house: selectedHouseVal
          })
        });
    return req.json();
}

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
      setDepartmentSelectedVal(departmentListVal[0])
    } catch {
      setDepartmentSelectedVal("")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      handleAdd();
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
      <h3 className="bold">Manage Departments</h3>
      <InputText type="text" placeholder="Department name" value={deptText} onChange={(e) => setDeptText(e.target.value)} onKeyDown={handleKeyDown}/>
      <Button className="!mx-0 my-1" onClick={handleAdd}>Add</Button>
      {
        depts.length === 0 || depts.constructor !== Array ? 
        <p className="italic mt-0">No departments yet, add one!</p>
        :
        <div className="flex flex-wrap">
          { depts.map(dept => 
            <XButtonText onClick={() => handleDelete(dept._id)} key={dept._id}>
              {dept.department}
            </XButtonText> 
            // <div key={dept._id}>
            //   <p>{dept.department}</p> 
            //   <button onClick={() => handleDelete(dept._id)}>X</button>
            // </div> 
          )}
        </div>

      }

    </div>
  )
}

export default ManageDepts;