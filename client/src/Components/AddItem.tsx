import React, { useEffect, useState, useContext } from 'react'
import { onlineManager, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Context } from '../AppWrapper';
import { mongoObjectId } from '../helper';

function AddItem() {

  const queryClient = useQueryClient()

  const [item, setItem] = useState("");
  const {personSelected, personList, departmentSelected, departmentList, selectedHouse, selectedList, lists} = useContext(Context);

  const [personSelectedVal, setPersonSelectedVal] = personSelected;
  const [personListVal, setPersonListVal] = personList;

  const [departmentSelectedVal, setDepartmentSelectedVal] = departmentSelected;
  const [departmentListVal, setDepartmentListVal] = departmentList;

  const [selectedListVal, setSelectedListVal] = selectedList;
  const [selectedHouseVal, setSelectedHouseVal] = selectedHouse;

  const [listsVal, setListsVal] = lists;

  const fetchGetDepts = async () => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/departments/${selectedHouseVal}`, {
      credentials: "include"
    })
    return req.json();
  }

  const fetchGetPeople = async () => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/people/${selectedHouseVal}`, {
      credentials: "include"
    })
    return req.json();
  }
// <><
  const fetchAddQuery = async ({itemName, wantedBy, department, apartOflist, tempId, originalTimeCreated}) => {
    // const listId = listsVal.filter(list => list.name == selectedListVal)[0]._id;
    let reqBody;
    if (tempId) {
      reqBody = JSON.stringify({ 
              item: itemName,
              wantedBy: wantedBy,
              department: department,
              apartOfList: apartOflist,
              originalTimeCreated: originalTimeCreated,
              tempId: tempId
            })
    } else {
      reqBody = JSON.stringify({ 
              item: itemName,
              wantedBy: wantedBy,
              department: department,
              apartOfList: apartOflist,
              originalTimeCreated: originalTimeCreated,
            })
    }
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/items/${apartOflist}`, {
            method: 'post',
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: reqBody 
          });
      setItem("");
      return req.json();
  }

  const deptQuery = useQuery({
    queryFn: fetchGetDepts,
    queryKey: ["deptGetQuery"],
    staleTime: Infinity,
    gcTime: Infinity
  })

  const peopleQuery = useQuery({
    queryFn: fetchGetPeople,
    queryKey: ["peopleGetQuery"],
    staleTime: Infinity,
    gcTime: Infinity
  })


  const addLocal = ({itemName, wantedBy, department, apartOflist, tempId, originalTimeCreated}) => {
    
    queryClient.setQueryData(["getQuery"], (itemsList: Array<any>) => {
      const newList = [...itemsList];
      newList.push({
        completed: false,
        wantedBy: wantedBy,
        department: department,
        item: itemName,
        apartOfList: apartOflist,
        tempId: tempId,
        originalTimeCreated: originalTimeCreated,
        _id: tempId
      });
      return newList;
    })
  }

  const addItemQuery = useMutation({
    mutationFn: fetchAddQuery,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({queryKey: ["getQuery"]});
      addLocal(payload);
      if (!window.navigator.onLine) {
        setItem("");
      }
    },
    onSuccess: () => {
        // queryClient.invalidateQueries({ queryKey: ["getQuery"]})
    }
  })

  const handleAdd = async () => {
    if (item != "" && selectedListVal != "") {
      const tempId = mongoObjectId();
      const listId = listsVal.filter(list => list.name == selectedListVal)[0]._id;
      addItemQuery.mutate({originalTimeCreated: Date.now(), itemName: item, wantedBy: personSelectedVal, department: departmentSelectedVal, apartOflist: listId, tempId: tempId}); 
    } else {
      // TODO: send error cuz of blank string
    }
  }

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      handleAdd();
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

    setPersonSelectedVal("None")
    setDepartmentSelectedVal("None")

  }, [peopleQuery.isSuccess, deptQuery.isSuccess]);

  return (
    <div>
      <h1>Add to list</h1>
      <input type="text" value={item} onChange={(e) => setItem(e.target.value)} onKeyDown={handleKeyDown} />
      <button onClick={handleAdd}>Add</button>

      <div className="categories">
        <h3>Wanted by:</h3>
        <select name="wantedBy" id="wantedBy" value={personSelectedVal} onChange={e => handlePersonChange(e.target.value)}>
          <option>None</option>
          { personListVal.constructor === Array && personListVal.map(person => <option key={person._id}>{person.name}</option>)  } 
        </select>
        <h3>Department</h3>
        <select name="dept" id="dept" value={departmentSelectedVal} onChange={e => handleDepartmentChange(e.target.value)}>
          <option>None</option>
          { departmentListVal.constructor === Array && departmentListVal.map(dept => <option key={dept._id}>{dept.department}</option>) } 
        </select>
      </div>
    </div>
  )
}

export default AddItem;