import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'


const ManageHouses = () => {

  const queryClient = useQueryClient();

  const [newHouseName, setNewHouseName] = useState("");
  const [newHousePassphrase, setNewHousePassphrase] = useState("");
  const [joinHouseName, setJoinHouseName] = useState("");
  const [joinHousePassphrase, setJoinHousePassphrase] = useState("");
  const [deletePassphrase, setDeletePassphrase] = useState("");
  const [selectedHouse, setSelectedHouse] = useState("");
  const [housesList, setHousesList] = useState([]);
  const [deleteMsg, setDeleteMsg] = useState("")

  const fetchGetQuery = async () => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/houses`)
    return req.json();
  }

  const fetchAddQuery = async ({name, passphrase}) => {
    if (name != "" && passphrase != "") {
      const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/houses`, {
              method: 'post',
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name: name, passphrase: passphrase })
            });
        return req.json();
    }
  }

  /// TODO: this
  const fetchUpdateQuery = async (id : string, newName : string) => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/houses/${id}`, {
            method: 'put',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: newName })
          });
      return req.json();
  }

  const fetchDeleteQuery = async ({id, passphrase}) => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/houses/${id}`, {
            method: 'delete',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({passphrase: passphrase})
          });
      return req.json();
  }



  const housesQuery = useQuery({
    queryFn: fetchGetQuery,
    queryKey: ["housesGetQuery"]
  })


  const addMutation = useMutation({
    mutationFn: fetchAddQuery,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["housesGetQuery"]})
    }
  })

  const updateMutation = useMutation({
    mutationFn: fetchUpdateQuery,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["housesGetQuery"]})
    }
  })

  const deleteMutation = useMutation({
    mutationFn: fetchDeleteQuery,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["housesGetQuery"]})
    }
  })

  const handleAddHouse = () => {
    if (newHouseName != "" && newHousePassphrase != "") {
      addMutation.mutate({name: newHouseName, passphrase: newHousePassphrase})
      setNewHouseName("");
      setNewHousePassphrase("");
    }
  }

  const handleJoinHouse = () => {

  }

  const handleDelete = async () => {
    if (housesList.length > 0) {
      deleteMutation.mutate({id: housesList.filter((h) => h.name == selectedHouse)[0]._id, passphrase: deletePassphrase}, 
      {onSuccess: (data) => {
        setDeletePassphrase("");  
        setDeleteMsg(data.msg)
      }});
    } else {
      setDeleteMsg("No houses to delete")
    }
  }

  useEffect(() => {
    housesQuery.isSuccess && setHousesList(housesQuery.data)
    try {
      housesQuery.isSuccess && setSelectedHouse(housesQuery.data[0].name)
    } catch (e) {
      setSelectedHouse("")
    }
  }, [housesQuery.data]);

  return (
    <div>
      <h3>Current house</h3>
      <select value={selectedHouse} onChange={e => setSelectedHouse(e.target.value)}>
        { housesList.length > 0 ? housesList.map(house => <option key={house._id}>{house.name}</option>) : ""}
      </select>
      <input type="text" placeholder="passphrase" value={deletePassphrase} onChange={e => setDeletePassphrase(e.target.value)}/>
      <button onClick={handleDelete}>Delete current house</button>
      <p>{deleteMsg}</p>

      <h3>Add new house</h3>
      <div>
        <input type="text" placeholder="House name" value={newHouseName} onChange={e => setNewHouseName(e.target.value)}/>
        <input type="text" placeholder="Passphrase" value={newHousePassphrase} onChange={e => setNewHousePassphrase(e.target.value)}/>
        <button onClick={handleAddHouse}>Add</button>
      </div>

      <h3>Join a house</h3>
      <div>
        <input type="text" placeholder="House name" value={joinHouseName} onChange={e => setJoinHouseName(e.target.value)}/>
        <input type="text" placeholder="Passphrase" value={joinHousePassphrase} onChange={e => setJoinHousePassphrase(e.target.value)}/>
        <button onClick={handleJoinHouse}>Join!</button> 
      </div>
    </div>
  )
}

export default ManageHouses