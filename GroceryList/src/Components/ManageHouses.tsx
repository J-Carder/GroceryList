import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../App';


const ManageHouses = () => {

  const queryClient = useQueryClient();

  const [newHouseName, setNewHouseName] = useState("");
  const [newHousePassphrase, setNewHousePassphrase] = useState("");
  const [joinHouseName, setJoinHouseName] = useState("");
  const [joinHousePassphrase, setJoinHousePassphrase] = useState("");
  const [deletePassphrase, setDeletePassphrase] = useState("");
  const [housesList, setHousesList] = useState<Array<any>>([]);

  const {user, selectedList, personSelected, lists, selectedHouse, departmentList} = useContext(Context);

  const [userVal, setUserVal] = user;
  const [selectedListVal, setSelectedListVal] = selectedList;
  const [listsVal, setListsVal] = lists;
  const [selectedHouseVal, setSelectedHouseVal] = selectedHouse;
  const [departmentListVal, setDepartmentListVal] = departmentList;

  const fetchGetQuery = async () => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/houses`, {
      credentials: "include"
    })
    return req.json();
  }

  const fetchAddQuery = async ({name, passphrase}) => {
    if (name != "" && passphrase != "") {
      const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/houses`, {
              method: 'post',
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ name: name, passphrase: passphrase })
            });
        return req.json();
    }
  }

  /// TODO: this
  const fetchUpdateQuery = async ({id, newName}) => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/houses/${id}`, {
            method: 'put',
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
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
            credentials: "include",
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
        setNewHouseName("");
        setNewHousePassphrase("");
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
    }
  }

  const leaveHouseMutation = useMutation(
    {
      mutationFn: async () => {
        const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/users/house`, {
          method: "delete",
          credentials: "include"
        })
        return req.json();
      },
      onSuccess: (data) => {
        if (data.msg == "Error") {
          console.log("error")
        } else {
          let tempVal = userVal;
          delete tempVal.houses
          setUserVal(tempVal);
          setListsVal([]);
          setSelectedHouseVal("");
        }
      }
    }
  )

  const handleLeaveHouse = () => {
    leaveHouseMutation.mutate();
  }

  const joinHouseMutation = useMutation({
    mutationFn: async () => {
          const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/users/house/${joinHouseName}`, {
          method: "post",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            passphrase: joinHousePassphrase
          })
        })
        return req.json();
    },
    onSuccess: (data) => {
      if (data.msg != "Joined") {
        console.log("Error");
      } else {
        setUserVal(userVal => { return {...userVal, houses: [joinHouseName]}});
        try {
          setSelectedHouseVal(joinHouseName)
        } catch (e) {
          setSelectedHouseVal("");
        }
        queryClient.invalidateQueries({queryKey: ["listGetQuery"]})
        // queryClient.invalidateQueries({queryKey: ["deptGetQuery"]})
      }
    }
  })

  const handleJoinHouse = () => {
    joinHouseMutation.mutate();
  }

  const handleDelete = async () => {
    if (housesList.length > 0) {
      deleteMutation.mutate({id: housesList.filter((h) => h.name == selectedHouseVal)[0]._id, passphrase: deletePassphrase}, 
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
    // try {
    //   housesQuery.isSuccess && setSelectedHouseVal(housesQuery.data[0].name)
    // } catch (e) {
    //   setSelectedHouseVal("")
    // }
  }, [housesQuery.data]);

  return (
    <div>
      <h3>Manage Houses</h3>
      {/* <h3>Add new house</h3>
      <div>
        <input type="text" placeholder="House name" value={newHouseName} onChange={e => setNewHouseName(e.target.value)}/>
        <input type="text" placeholder="Passphrase" value={newHousePassphrase} onChange={e => setNewHousePassphrase(e.target.value)}/>
        <button onClick={handleAddHouse}>Add</button>
      </div> */}


      {/* <button onClick={() => {
        console.log(userVal)
      }}>
        Click
      </button> */}

      {
        userVal?.houses?.length > 0 ? 
        <>
          <h3>Current house</h3>
          <p>{userVal?.houses && userVal?.houses[0]}</p>
          <h3>Leave current house</h3>
          <button onClick={handleLeaveHouse}>Leave</button>
        </>
        :
        <>
          <h3>Join a house</h3>
          <div>
            <input type="text" placeholder="House name" value={joinHouseName} onChange={e => setJoinHouseName(e.target.value)}/>
            <input type="text" placeholder="Passphrase" value={joinHousePassphrase} onChange={e => setJoinHousePassphrase(e.target.value)}/>
            <button onClick={handleJoinHouse}>Join!</button> 
          </div>
        </>
      }

    </div>
  )
}

export default ManageHouses