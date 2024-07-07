import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../AppWrapper';
import Button from "./Button";
import InputText from "./InputText";


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
    queryKey: ["housesGetQuery"],
    staleTime: Infinity,
    gcTime: Infinity
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
      }});
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
      <h3 className="bold">Manage Houses</h3>

      {
        userVal?.houses?.length > 0 ? 
        <>
          <p className="italic">Current house: {userVal?.houses && userVal?.houses[0]}</p>
          <Button className="!mx-0 mt-1" onClick={handleLeaveHouse}>Leave</Button>
        </>
        :
        <>
          <p className="italic">Join a house</p>
          <div>
            <InputText type="text" placeholder="House name" value={joinHouseName} onChange={e => setJoinHouseName(e.target.value)}/>
            <InputText type="text" placeholder="Passphrase" value={joinHousePassphrase} onChange={e => setJoinHousePassphrase(e.target.value)}/>
            <Button className="!mx-0 mt-1" onClick={handleJoinHouse}>Join!</Button> 
          </div>
        </>
      }

    </div>
  )
}

export default ManageHouses