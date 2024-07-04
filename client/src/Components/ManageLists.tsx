import React, { useEffect, useState, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Context } from '../AppWrapper';


const ManageLists = () => {

  const queryClient = useQueryClient();
  const [listName, setListName] = useState("");

  const {selectedList, selectedHouse, user, lists} = useContext(Context);

  const [selectedListVal, setSelectedListVal] = selectedList;
  const [selectedHouseVal, setSelectedHouseVal] = selectedHouse;
  const [userVal, setUserVal] = user;
  const [listsVal, setListsVal] = lists;

  const fetchGetQuery = async () => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/lists/${userVal.houses[0]}`, 
      {
        method: "get",
        credentials: "include"
      }
    )
    return req.json();
  }

  const fetchAddQuery = async (listName : string) => {
    if (listName != "") {
      const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/lists/${selectedHouseVal}`, {
              method: 'post',
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ name: listName })
            });
        return req.json();
    } 
  }

  const fetchDeleteQuery = async (id : string) => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/lists/${id}`, {
            method: 'delete',
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include"
          });
      return req.json();
  }


  const getQuery = useQuery({
    queryFn: fetchGetQuery,
    queryKey: ["listGetQuery"]
  })


  const addMutation = useMutation({
    mutationFn: fetchAddQuery,
    onSuccess: () => {
      setListName("");
      queryClient.invalidateQueries({ queryKey: ["listGetQuery"]})
    }
  })

  const deleteMutation = useMutation({
    mutationFn: fetchDeleteQuery,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getQuery"]})
        queryClient.invalidateQueries({ queryKey: ["listGetQuery"]})
    }
  })

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      handleAdd();
    }
  } 

  const handleAdd = () => {
    addMutation.mutate(listName);
  }

  const handleDelete = () => {
    if (listsVal.length > 0) {
      deleteMutation.mutate(listsVal.filter((l) => l.name == selectedListVal)[0]._id);
    }
  }


  useEffect(() => {
    if (listsVal.length == 0) {
      setSelectedListVal("");
      console.log("listVal" + selectedListVal)
    }
  }, [listsVal])

  useEffect(() => {
    getQuery.isSuccess && setListsVal(getQuery.data) ;
    try {
      getQuery.isSuccess && setSelectedListVal(getQuery.data[0].name);
    } catch (e) {
      setSelectedListVal("");
    }
  }, [getQuery.isSuccess, getQuery.data]);

  if (getQuery.status === "pending") {
    return <h1>loading</h1>
  }

  if (getQuery.status === "error") {
    return <h1>error!</h1>
  }

  return (
    <div>
      <h3>Manage lists</h3>
      {
        listsVal.length > 0 ? 
        <>
          <select value={selectedListVal} onChange={(e) => setSelectedListVal(e.target.value)}>
            { listsVal.constructor === Array && listsVal.map(list => <option key={list._id}>{list.name}</option>) }
          </select>
          <button onClick={handleDelete}>Delete selected</button>
        </>
        :
        <p>No lists yet, add one below!</p>
      }

      <div>
        <input type="text" placeholder="List name" value={listName} onChange={(e) => setListName(e.target.value)} onKeyDown={handleKeyDown} />
        <button onClick={handleAdd}>Add</button>
      </div>
    </div>
  )
}

export default ManageLists;