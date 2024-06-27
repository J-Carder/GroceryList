import React, { useContext, useEffect, useState } from 'react'
import AddItem from './AddItem'
import '../css/Home.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ManageLists from './ManageLists'
import { Context } from '../AppWrapper'
import SortItems from './SortItems'
import ItemSettings from './ItemSettings'

const Home = ({setPage}) => {

  const queryClient = useQueryClient()

  const [itemsList, setItemsList] = useState<Array<any>>([]);
  const {user, lists, selectedList, selectedHouse, sortBy, order, online, offlineState, syncBackend} = useContext(Context);

  const [listsVal, setListsVal] = lists;
  const [selectedListVal, setSelectedListVal] = selectedList;
  const [userVal, setUserVal] = user;
  const [selectedHouseVal, setSelectedHouseVal] = selectedHouse; 
  const [sortByVal, setSortByVal] = sortBy; 
  const [orderVal, setOrderVal] = order;
  const [onlineVal, setOnlineVal] = online;
  const [offlineStateVal, setOfflineStateVal] = offlineState;

  const fetchGetQuery = async () => {
    const listId = listsVal.filter(list => list.name == selectedListVal)[0]._id;
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/items/${listId}`, {
      credentials: "include",
    })
    return req.json();
  }

  const {data: items, status} = useQuery({
    queryFn: fetchGetQuery,
    queryKey: ["getQuery"],
    staleTime: Infinity,
    gcTime: Infinity
  })

  const fetchDeleteQuery = async (id : string) => {
    const listId = listsVal.filter(list => list.name == selectedListVal)[0]._id;
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/items/${id}`, {
            method: 'delete',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({
              apartOfList: listId
            })
          });
      return req.json();
  }

  const fetchUpdateQuery = async ({id, checked, tempId}) => {
    const listId = listsVal.filter(list => list.name == selectedListVal)[0]._id;

    const reqPath = `${import.meta.env.VITE_REACT_APP_API}/items/${id}`
    const reqBody = {
          method: 'put',
          headers: {
              "Content-Type": "application/json",
            },
          credentials: "include",
          body: JSON.stringify({ 
            completed: checked,
            apartOfList: listId,
            tempId: tempId
          })
        };

    const req = await fetch(reqPath, reqBody);
    return req.json();
  }


  const deleteLocal = (
      id: string
    ) => {
      queryClient.setQueryData(['getQuery'], (itemsList : Array<any>) => {
        return itemsList.filter(item => item._id != id);
      });
    };  

  const deleteMutation = useMutation({
    mutationFn: fetchDeleteQuery,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({queryKey: ["getQuery"]});
      deleteLocal(payload);
    },
    onSuccess: (data) => {
      // queryClient.invalidateQueries({ queryKey: ["getQuery"]});
    }
  });
  
  const handleEdit = (id, checked, tempId) => {
    updateMutation.mutate({ id: id, checked: checked, tempId: tempId });
  }

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  }

  const updateLocal = (
      id: string,
      completed: boolean,
      tempId: string
    ) => {
      queryClient.setQueryData(['getQuery'], (itemsList : Array<any>) => {
        return itemsList.map(item => {
          if (item._id === id) {
            return {...item, completed};
          }
          return item;
        });
      });
    };  
  
  const updateMutation = useMutation({
    mutationFn: fetchUpdateQuery,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({queryKey: ["getQuery"]});
      updateLocal(payload.id, payload.checked, payload.tempId);
    },
  });


  const dateFromObjectId = function (objectId) {
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
  };

  const refreshSort = (itemsList) => {
    if (orderVal == "Descending") {
      if (sortByVal == "Department") {
        itemsList.sort((a, b) => a.department < b.department ? 1 : -1)
      } else if (sortByVal == "Person") {
        itemsList.sort((a, b) => a.wantedBy < b.wantedBy ? 1 : -1)
      } else {
        itemsList.sort((a, b) => dateFromObjectId(a._id) < dateFromObjectId(b._id) ? 1 : -1)
      }
    } else {
      if (sortByVal == "Department") {
        itemsList.sort((a, b) => a.department > b.department ? 1 : -1)
      } else if (sortByVal == "Person") {
        itemsList.sort((a, b) => a.wantedBy > b.wantedBy ? 1 : -1)
      } else {
        itemsList.sort((a, b) => dateFromObjectId(a._id) > dateFromObjectId(b._id) ? 1 : -1)
      }
    }

    return itemsList;
  }

  useEffect(() => {
    queryClient.invalidateQueries({queryKey: ["getQuery"]});
  }, [selectedListVal])


  useEffect(() => {
    if (status == "success") {
      const tempItems = [...items];
      setItemsList(tempItems);
    }
  }, [items, status])
  
  useEffect(() => {
    if (status == "success") {
      const tempItemsList = [...items];
      setItemsList(refreshSort(tempItemsList));
    }
  }, [sortByVal, orderVal, items])


  return (
    <div>
      <>
        <h2>Grocery List</h2>
        <button onClick={() => setPage("settings")}>Settings</button>
      </>

      {
        userVal?.houses?.length > 0 ? 
        <>
          <ManageLists />
          <hr />
          <AddItem />
          <SortItems />
          <ItemSettings itemsList={itemsList} setItemsList={setItemsList} />
          {
            itemsList.length === 0 ? 
            <div><h2>Empty!</h2></div>
            :
            itemsList.map(item => 
              <div className="item" key={item._id} onClick={(e) => handleEdit(item._id, !item.completed, item.tempId ? item.tempId : false)}>
                <p className="itemContent"> 
                  <input type="checkbox" onChange={(e) => handleEdit(item._id, e.target.checked, item.tempId ? item.tempId : false)} checked={item.completed} />
                  <span className={item.completed ? "strike" : ""}>
                    <span className="bold">{item.item}</span>
                      {item.department != "" && item.department != "None" ? <> <span className="em">in</span> {item.department}</> : ""}
                      {item.wantedBy != "" && item.wantedBy != "None" ? <> <span className="em">by</span> {item.wantedBy}</> : ""}
                  </span>
                  <button onClick={() => handleDelete(item._id)}>X</button>
                </p>
              </div> 
            )
          }
        </>
        : 
          <p>Welcome! First, head over to Settings to join a house</p>
        }
        <button
         onClick={() => {
          console.log(deleteMutation.isPaused, updateMutation.isPaused);
         }}>CHeck paused</button>
    </div>
  )
}

export default Home;