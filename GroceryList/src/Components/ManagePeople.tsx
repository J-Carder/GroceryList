import React, { useState, useContext } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Context } from '../App';

const fetchGetQuery = async () => {
  const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/people`, {
    credentials: "include"
  })
  return req.json();
}

const fetchAddQuery = async (newName : string) => {
  if (newName != "") {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/people`, {
            method: 'post',
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ name: newName })
          });
      return req.json();
  }
}

const fetchUpdateQuery = async ({id, newName}) => {
  const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/people/${id}`, {
          method: 'put',
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ name: newName })
        });
    return req.json();
}

const fetchDeleteQuery = async (id : string) => {
  const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/people/${id}`, {
          method: 'delete',
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        });
    return req.json();
}

function ManagePeople() {

  const queryClient = useQueryClient()
  const [peopleText, setPeopleText] = useState("");

  const {personSelected, personList} = useContext(Context);

  const [personSelectedVal, setPersonSelectedVal] = personSelected;
  const [personListVal, setPersonListVal] = personList;

  const {data: people, status: peopleStatus} = useQuery({
    queryFn: fetchGetQuery,
    queryKey: ["peopleGetQuery"]
  })

  const addMutation = useMutation({
    mutationFn: fetchAddQuery,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["peopleGetQuery"]})
    }
  })

  const updateMutation = useMutation({
    mutationFn: fetchUpdateQuery,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["peopleGetQuery"]})
    }
  })

  const deleteMutation = useMutation({
    mutationFn: fetchDeleteQuery,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["peopleGetQuery"]})
    }
  })

  const handleAdd = () => {
    addMutation.mutate(peopleText);
    setPersonSelectedVal(peopleText);
    setPeopleText("");
  }

  const handleDelete = (id : string) => {
    deleteMutation.mutate(id);
    try {
      setPersonSelectedVal(personListVal[0])
    } catch {
      setPersonSelectedVal("")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      handleAdd();
      setPeopleText("");
    }
  }

  if (peopleStatus === "pending") {
    return <h1>loading</h1>
  }

  if (peopleStatus === "error") {
    return <h1>error!</h1>
  }

  return (
    <div>
      <input type="text" value={peopleText} onChange={(e) => setPeopleText(e.target.value)} onKeyDown={handleKeyDown}/>
      <button onClick={handleAdd}>Add</button>
      {
        people.length === 0 ? 
        <div><h2>Empty!</h2></div>
        :
        people.map(person => 
          <div key={person._id}>
            <p>{person.name}</p> 
            <button onClick={() => handleDelete(person._id)}>X</button>
          </div> 
        )
      }

    </div>
  )
}

export default ManagePeople