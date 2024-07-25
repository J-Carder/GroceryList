import React, { useEffect, useState, useContext } from 'react'
import { onlineManager, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Context } from '../AppWrapper';
import { mongoObjectId } from '../Misc/helper';
import InputText from "./InputText";
import InputAdd from "./InputAdd";
import SelectListCustom from "./SelectListCustom";
import Status from "./Status";

// add item to list component
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

  const [status, setStatus] = useState("");

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
  const fetchAddQuery = async ({tempApartOfList, itemName, wantedBy, department, apartOflist, tempId, originalTimeCreated}) => {
    // const listId = listsVal.filter(list => list.name == selectedListVal)[0]._id;
    const reqBody = JSON.stringify({ 
            item: itemName,
            wantedBy: wantedBy,
            department: department,
            apartOfList: apartOflist,
            originalTimeCreated: originalTimeCreated,
            tempId: tempId,
            tempApartOfList: tempApartOfList
          });
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


  const addLocal = ({tempApartOfList, itemName, wantedBy, department, apartOflist, tempId, originalTimeCreated}) => {
    
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
        _id: tempId,
        tempApartOflist: tempApartOfList
      });
      setItem("");
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
      setStatus("");
      const tempId = mongoObjectId();
      const tempListId = listsVal.filter(list => list.name == selectedListVal)[0].tempId;
      const listId = listsVal.filter(list => list.name == selectedListVal)[0]._id;
      addItemQuery.mutate({ tempApartOfList: tempListId, originalTimeCreated: Date.now(), itemName: item, wantedBy: personSelectedVal, department: departmentSelectedVal, apartOflist: listId, tempId: tempId}); 
    } else {
      if (item == "") setStatus("Can't add blank item")
      if (selectedListVal == "") setStatus("Can't add to blank list")
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
    <div className="m-2">
      <InputAdd onClick={handleAdd} type="text" placeholder="Add item" value={item} onChange={(e) => setItem(e.target.value)} onKeyDown={handleKeyDown} />
      <Status>{status}</Status>
      <div className="flex justify-center mt-4 mb-2">
        <p className="text-white bold mt-1 mr-1">by</p>
        <SelectListCustom defaultVal={"None"} listVal={personListVal} listFn={person => <option key={person._id}>{person.name}</option>} value={personSelectedVal} setFn={e => handlePersonChange(e.target.value)}/>
        <p className="text-white bold mt-1 mr-1">in</p>
        <SelectListCustom defaultVal={"None"} listVal={departmentListVal} listFn={dept => <option key={dept._id}>{dept.department}</option>} value={departmentSelectedVal} setFn={e => handleDepartmentChange(e.target.value)}/>
      </div>

      {/* <div className="categories">
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
      </div> */}
    </div>
  )
}

export default AddItem;