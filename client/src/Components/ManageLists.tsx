import React, { useEffect, useState, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Context } from '../AppWrapper';
import { mongoObjectId } from '../helper';
import Button from "./Button";
import InputText from "./InputText";


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

  const fetchAddQuery = async ({listName, tempId}) => {
    if (listName != "") {
      const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/lists/${selectedHouseVal}`, {
              method: 'post',
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ name: listName, tempId: tempId })
            });
        setListName("");
        return req.json();
    } 
  }

  const fetchDeleteQuery = async ({id, tempId}) => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/lists/${id}`, {
            method: 'delete',
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              tempId: tempId
            })
          });
      return req.json();
  }


  const getQuery = useQuery({
    queryFn: fetchGetQuery,
    queryKey: ["listGetQuery"]
  })

  const addLocal = ({listName, tempId}) => {
    queryClient.setQueryData(["listGetQuery"], (listsList: Array<any>) => {
      const newList = [...listsList];
      newList.push({
        name: listName,
        apartOfHouse: selectedHouseVal,
        tempId: tempId,
        _id: tempId
      });
      return newList;
    })
  }


  const addMutation = useMutation({
    mutationFn: fetchAddQuery,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({queryKey: ["getQuery"]});
      addLocal(payload);
      if (!window.navigator.onLine) {
        setListName("");
      }
    },
    // onSettled: () => {
    //   setListName("");
    // },
    // onSuccess: () => {
    //   setListName("");
    //   queryClient.invalidateQueries({ queryKey: ["listGetQuery"]})
    // }
  })


  const deleteLocal = ({id, tempId}) => {
    queryClient.setQueryData(["listGetQuery"], (listsList : Array<any>) => {
      return listsList.filter(list => list._id != id);
    });
  }

  const deleteMutation = useMutation({
    mutationFn: fetchDeleteQuery,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({queryKey: ["listGetQuery"]})
      deleteLocal(payload);
    },
    // onSuccess: () => {
    //     queryClient.invalidateQueries({ queryKey: ["getQuery"]})
    //     queryClient.invalidateQueries({ queryKey: ["listGetQuery"]})
    // }
  })

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      handleAdd();
    }
  } 

  const handleAdd = () => {
    addMutation.mutate({listName: listName, tempId: mongoObjectId()});
  }

  const handleDelete = () => {
    if (listsVal.length > 0) {
      const id = listsVal.filter((l) => l.name == selectedListVal)[0]._id
      const tempId = listsVal.filter((l) => l.name == selectedListVal)[0].tempId
      deleteMutation.mutate({id: id, tempId: tempId});
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
    selectedHouseVal ?
    <div>
      <h3 className="bold">Manage lists</h3>
      {
        listsVal.length > 0 ? 
        <>
          <select className="border bg-gray-800 text-white rounded-xl p-2" value={selectedListVal} onChange={(e) => setSelectedListVal(e.target.value)}>
            { listsVal.constructor === Array && listsVal.map(list => <option key={list._id}>{list.name}</option>) }
          </select>
          <Button className="!mx-0 inline px-3" onClick={handleDelete}>Delete</Button>
        </>
        :
        <p>No lists yet, add one below!</p>
      }

      <div>
        <InputText type="text" placeholder="List name" value={listName} onChange={(e) => setListName(e.target.value)} onKeyDown={handleKeyDown} />
        <Button className="!mx-0 inline px-3 mt-1" onClick={handleAdd}>Add</Button>
      </div>
    </div>
    : 
    ""
  )
}

export default ManageLists;