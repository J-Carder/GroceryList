import React, { useEffect, useState, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Context } from '../App';

const fetchGetQuery = async () => {
  const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/lists`)
  return req.json();
}

const fetchAddQuery = async (listName : string) => {
  if (listName != "") {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/lists`, {
            method: 'post',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: listName, apartOfHouse: "default" })
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
        });
    return req.json();
}


const ManageLists = () => {


  const queryClient = useQueryClient();
  const [listName, setListName] = useState("");
  const [lists, setLists] = useState([]);

  const {selectedList} = useContext(Context);

  const [selectedListVal, setSelectedListVal] = selectedList;


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
    if (lists.length > 0) {
      deleteMutation.mutate(lists.filter((l) => l.name == selectedListVal)[0]._id);
    }
  }

  useEffect(() => {
    getQuery.isSuccess && setLists(getQuery.data) ;
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
      <h3>Add new list</h3>
      <select value={selectedListVal} onChange={(e) => setSelectedListVal(e.target.value)}>
        { lists.map(list => <option key={list._id}>{list.name}</option>) }
      </select>
      <button onClick={handleDelete}>Delete selected</button>
      <div>
        <input type="text" placeholder="List name" value={listName} onChange={(e) => setListName(e.target.value)} onKeyDown={handleKeyDown} />
        <button onClick={handleAdd}>Add</button>
      </div>
    </div>
  )
}

export default ManageLists