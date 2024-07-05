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
  const {user, lists, selectedList, sortBy, order} = useContext(Context);

  const [listsVal, setListsVal] = lists;
  const [selectedListVal, setSelectedListVal] = selectedList;
  const [userVal, setUserVal] = user;
  const [sortByVal, setSortByVal] = sortBy; 
  const [orderVal, setOrderVal] = order;

  const fetchGetQuery = async () => {
    const listId = listsVal.filter(list => list.name == selectedListVal)[0]._id;
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/items/${listId}`, {
      credentials: "include",
    })
    return req.json();
  }

  const itemsQuery = useQuery({
    queryFn: fetchGetQuery,
    queryKey: ["getQuery"],
    staleTime: Infinity,
    gcTime: Infinity
  })

  const fetchDeleteQuery = async ({id, tempId}) => {
    const listId = listsVal.filter(list => list.name == selectedListVal)[0]._id;
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/items/${id}`, {
            method: 'delete',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({
              apartOfList: listId,
              tempId: tempId
            })
          });
      return req.json();
  }

  const fetchUpdateQuery = async ({id, checked, tempId}) => {
    const listId = listsVal.filter(list => list.name == selectedListVal)[0]._id;

    const reqPath = `${import.meta.env.VITE_REACT_APP_API}/items/${id}`
    const reqBody : RequestInit= {
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


  const deleteLocal = ({
      id, tempId
    }) => {
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

  const handleDelete = (id, tempId) => {
    deleteMutation.mutate({id, tempId});
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
    const tempList = itemsList;
    if (orderVal == "Descending") {
      if (sortByVal == "Department") {
        tempList.sort((a, b) => a.department < b.department ? 1 : -1)
      } else if (sortByVal == "Person") {
        tempList.sort((a, b) => a.wantedBy < b.wantedBy ? 1 : -1)
      } else {
        tempList.sort((a, b) => a.originalTimeCreated < b.originalTimeCreated ? 1 : -1)
      }
    } else {
      if (sortByVal == "Department") {
        tempList.sort((a, b) => a.department > b.department ? 1 : -1)
      } else if (sortByVal == "Person") {
        tempList.sort((a, b) => a.wantedBy > b.wantedBy ? 1 : -1)
      } else {
        tempList.sort((a, b) => a.originalTimeCreated > b.originalTimeCreated ? 1 : -1)
      }
    }
    return tempList;
  }

  const refreshList = () => {
    if (listsVal.length != 0 && !listsVal.msg && selectedListVal != "" && !itemsQuery.data?.msg && itemsQuery.data) {
      let tempItemsList = [...itemsQuery.data];
      console.log(listsVal)
      const listId = listsVal.filter(list => list.name == selectedListVal)[0]._id;
      tempItemsList = tempItemsList.filter((item) => item.apartOfList == listId);
      setItemsList(refreshSort(tempItemsList));
    }
  }


  useEffect(() => {
    if (itemsQuery.status == "success" && !itemsQuery.data.msg) {
      // const tempItems = [...itemsQuery.data];
      // setItemsList(tempItems);
      refreshList();
    }
  }, [itemsQuery.data, itemsQuery.status])

  useEffect(() => {
    queryClient.invalidateQueries({queryKey: ["getQuery"]});
    refreshList();
  }, [selectedListVal])

  useEffect(() => {
    if (itemsQuery.status == "success" && !itemsQuery.data.msg) {
      refreshList();
    }
  }, [sortByVal, orderVal, itemsQuery.data])


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
          {
            selectedListVal ?
            <>
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
                      <button onClick={() => handleDelete(item._id, item.tempId)}>X</button>
                    </p>
                  </div> 
                )
              }
          </>
            :
            ""
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