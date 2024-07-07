import React, { useContext, useEffect, useState } from 'react'
import AddItem from './AddItem'
import '../css/Home.css'
import { onlineManager, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ManageLists from './ManageLists'
import { Context } from '../AppWrapper'
import SortItems from './SortItems'
import ItemSettings from './ItemSettings'
import { socket } from '../socket'
import SelectList from "./SelectList"
import SelectListCustom from "./SelectListCustom"

const Home = ({setPage}) => {

  const queryClient = useQueryClient()

  const [itemsList, setItemsList] = useState<Array<any>>([]);
  const {user, lists, selectedList, sortBy, order} = useContext(Context);

  const [listsVal, setListsVal] = lists;
  const [selectedListVal, setSelectedListVal] = selectedList;
  const [userVal, setUserVal] = user;
  const [sortByVal, setSortByVal] = sortBy; 
  const [orderVal, setOrderVal] = order;
  const DEBUG = false;

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
  
  const handleEdit = (id, checked, tempId, e) => {
    // make sure we don't check when button (X button) is pressed
    if (e.target.localName != "button") {
      updateMutation.mutate({ id: id, checked: checked, tempId: tempId });
    }
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
    // don't invalidate if offline as this will send a query which will return the cache which won't include items added offline
    if (onlineManager.isOnline()) {
      queryClient.invalidateQueries({queryKey: ["getQuery"]});
    }
    refreshList();
  }, [selectedListVal])

  useEffect(() => {
    if (itemsQuery.status == "success" && !itemsQuery.data.msg) {
      refreshList();
    }
  }, [sortByVal, orderVal, itemsQuery.data])

// ---------------------------- //
// -----     SOCKET IO    ----- //
// ---------------------------- //

  useEffect(() => {
    socket.on("add", item => {
      console.log("ADDING");
      // get current query data
      const currentData : Array<any> = queryClient.getQueryData(["getQuery"])!;

      // make sure items aren't duplicated
      // if (currentData.filter((data) => data._id == item._id).length == 0 &&
      //     currentData.filter((data) => data.tempId == item.tempId).length == 0) {

      if (currentData.filter((data) => data._id == item._id).length == 0 &&
          currentData.filter((data) => data.tempId == item.tempId).length == 0) {
          queryClient.setQueryData(["getQuery"], (data : Array<any>) => {
          const newData = [...data];
          newData.push(item);
          return newData;
        });
      }
    })

    socket.on("delete", ({id, tempId}) => {
      console.log("DELETING");
      queryClient.setQueryData(["getQuery"], (data : Array<any>) => {
        return data.filter((item) => item._id != id && item.tempId != tempId);
      });
    })

    socket.on("update", ({id, tempId, completed}) => {
      console.log("UPDATING")
      queryClient.setQueryData(["getQuery"], (data : Array<any>) => {
        return data.map(item => {
          if (item._id == id || item.tempId == tempId) {
            return {...item, completed: completed}
          }
          return item;
        })
      })
    })

    socket.on("clear", (blank) => {
      console.log("CLEARING")
      queryClient.setQueryData(["getQuery"], (data : Array<any>) => {
        return data.filter(item => !item.completed);
      })
    })

    socket.on("fill", (comp) => {
      console.log("FILLING")
      queryClient.setQueryData(["getQuery"], (data : Array<any>) => {
        return data.map(item => {
          return {...item, completed: comp};
        })
      })
    })
  }, []);



  const fetchGetListQuery = async () => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/lists/${userVal.houses[0]}`, 
      {
        method: "get",
        credentials: "include"
      }
    )
    return req.json();
  }
  
  const getQuery = useQuery({
    queryFn: fetchGetListQuery,
    queryKey: ["listGetQuery"]
  })

  useEffect(() => {
    getQuery.isSuccess && setListsVal(getQuery.data) ;
    try {
      getQuery.isSuccess && setSelectedListVal(getQuery.data[0].name);
    } catch (e) {
      setSelectedListVal("");
    }
  }, [getQuery.isSuccess, getQuery.data]);

  return (
    <div>
      <div className="bg-green">
        <div className="flex flex-col items-center mx-3 pt-3">
          <SelectListCustom listVal={listsVal} listFn={list => <option key={list._id}>{list.name}</option>} value={selectedListVal} setFn={(e) => setSelectedListVal(e.target.value)}/>
          <AddItem />
        </div>
      </div>


      <button className="absolute top-4 right-5" onClick={() => setPage("settings")}>Settings</button>
      {
        userVal?.houses?.length > 0 ? 
        <>
          <hr />
              <SortItems />
              <ItemSettings itemsList={itemsList} setItemsList={setItemsList} />
              {
                itemsList.length === 0 ? 
                <div><h2>Empty!</h2></div>
                :
                itemsList.map(item => 
                  <div className="item" key={item._id} onClick={(e) => handleEdit(item._id, !item.completed, item.tempId ? item.tempId : false, e)}>
                    <p className="itemContent"> 
                      <input type="checkbox" onChange={(e) => handleEdit(item._id, e.target.checked, item.tempId ? item.tempId : false, e)} checked={item.completed} />
                      <span className={item.completed ? "strike" : ""}>
                        <span className="bold">{item.item}</span> 
                        { DEBUG ? 
                        
                        <>id:<span style={{color: "blue"}}>{item._id.substring(item._id.length - 5)}</span> temp:<span style={{color: "red"}}>{item.tempId.substring(item.tempId.length - 5)}</span></>
                          :
                            ""
                        }
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
          <p>Welcome! First, head over to Settings to join a house</p>
        }
        <button
         onClick={() => {
          console.log(deleteMutation.isPaused, updateMutation.isPaused);
         }}>Check paused</button>
    </div>
  )
}

export default Home;