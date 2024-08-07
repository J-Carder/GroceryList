import React, { useContext, useEffect, useState } from 'react'
import AddItem from '../Components/AddItem'
import { onlineManager, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Context } from '../AppWrapper'
import SortItems from '../Components/SortItems'
import ItemSettings from '../Components/ItemSettings'
import { socket } from '../Misc/socket'
import SelectListCustom from "../Components/SelectListCustom"
import { IoMdSettings } from "react-icons/io";
import { ImCross } from "react-icons/im";
import Status from "../Components/Status"


const Home = ({setPage}) => {

  const queryClient = useQueryClient()

  const [itemsList, setItemsList] = useState<Array<any>>([]);
  const {user, lists, selectedList, sortBy, order} = useContext(Context);

  const [listsVal, setListsVal] = lists;
  const [selectedListVal, setSelectedListVal] = selectedList;
  const [userVal, setUserVal] = user;
  const [sortByVal, setSortByVal] = sortBy; 
  const [orderVal, setOrderVal] = order;
  const [dupItemsList, setDupItemsList] = useState<Array<any>>([]);
  const DEBUG = false;

  // colours for different categories (ie. when sorted by dept or person it will go thru these colours)
  const colours = [
    "border-blue-600",
    "border-yellow-600",
    "border-pink-600",
    "border-indigo-600",
    "border-red-600",
    "border-teal-600",
    "border-orange-600",
    "border-blue-600",
  ]

  const textColours = [
    "text-blue-600",
    "text-yellow-600",
    "text-pink-600",
    "text-indigo-600",
    "text-red-600",
    "text-teal-600",
    "text-orange-600",
    "text-blue-600",
  ] 

  // get items
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

  // delete an item
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

  // update an item
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


  // delete local (optimistic update)
  const deleteLocal = ({
      id, tempId
    }) => {
      queryClient.setQueryData(['getQuery'], (itemsList : Array<any>) => {
        return itemsList.filter(item => item._id != id);
      });
    };  

  // delete
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

  // update locally (optimistic updates)
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

  // get the date from a mongo ID
  const dateFromObjectId = function (objectId) {
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
  };

  // function to sort items, takes in an itemsList and returns a new list
  const refreshSort = (itemsList) => {
    const tempList = itemsList;

    // sort descending
    if (orderVal == "Descending") {
      if (sortByVal == "By department") { // by dept
        tempList.sort((a, b) => a.department < b.department ? 1 : -1)
      } else if (sortByVal == "By person") { // by person
        tempList.sort((a, b) => a.wantedBy < b.wantedBy ? 1 : -1)
      } else { // default (time)
        tempList.sort((a, b) => a.originalTimeCreated < b.originalTimeCreated ? 1 : -1)
      }
    } else { // sort ascending
      if (sortByVal == "By department") { // by dept
        tempList.sort((a, b) => a.department > b.department ? 1 : -1)
      } else if (sortByVal == "By person") { // by person
        tempList.sort((a, b) => a.wantedBy > b.wantedBy ? 1 : -1)
      } else { // default (time)
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
      const tempSortedList = refreshSort(tempItemsList);
      setItemsList(tempSortedList);

      let counter = -1;
      let tempDupList;
      if (sortByVal == "By department") {
        tempDupList = tempSortedList.map((item, index) => {
          if (item.department != tempSortedList[index - 1]?.department) {
            counter++;
          }
          return {...item, colourCount: counter}
        })
      } else {
        tempDupList = tempSortedList.map((item, index) => {
          if (item.wantedBy != tempSortedList[index - 1]?.wantedBy) {
            counter++;
          }
          return {...item, colourCount: counter}
        })
      }
      
      setDupItemsList(tempDupList);

    }
  }


  useEffect(() => {
    if (itemsQuery.status == "success" && !itemsQuery.data.msg) {
      // const tempItems = [...itemsQuery.data];
      // setItemsList(tempItems);
      refreshList();
    }
  }, [itemsQuery.data, itemsQuery.status])

  // if dropdown for list changed
  useEffect(() => {
    // don't invalidate if offline as this will send a query which will return the cache which won't include items added offline
    if (onlineManager.isOnline()) {
      queryClient.invalidateQueries({queryKey: ["getQuery"]});
    }
    refreshList();
  }, [selectedListVal])

  // sort or order values changed update list
  useEffect(() => {
    if (itemsQuery.status == "success" && !itemsQuery.data.msg) {
      refreshList();
    }
  }, [sortByVal, orderVal, itemsQuery.data])

// ---------------------------- //
// -----     SOCKET IO    ----- //
// ---------------------------- //

  useEffect(() => {

    // add item
    socket.on("add", item => {
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
    
    // delete item
    socket.on("delete", ({id, tempId}) => {
      queryClient.setQueryData(["getQuery"], (data : Array<any>) => {
        return data.filter((item) => item._id != id && item.tempId != tempId);
      });
    })

    // update item
    socket.on("update", ({id, tempId, completed}) => {
      queryClient.setQueryData(["getQuery"], (data : Array<any>) => {
        return data.map(item => {
          if (item._id == id || item.tempId == tempId) {
            return {...item, completed: completed}
          }
          return item;
        })
      })
    })

    // clear items
    socket.on("clear", (blank) => {
      queryClient.setQueryData(["getQuery"], (data : Array<any>) => {
        return data.filter(item => !item.completed);
      })
    })

    // fill items
    socket.on("fill", (comp) => {
      queryClient.setQueryData(["getQuery"], (data : Array<any>) => {
        return data.map(item => {
          return {...item, completed: comp};
        })
      })
    })
  }, []);


  // fetch lists
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
        <div className="flex flex-col justify-center mx-3 pt-3">
          <div className="flex justify-center">
            <SelectListCustom addDefault={true} listVal={listsVal} listFn={list => <option key={list._id}>{list.name}</option>} value={selectedListVal} setFn={(e) => setSelectedListVal(e.target.value)}/>
          </div>
          <AddItem />
        </div>
      </div>

      <button className="absolute top-4 right-5" onClick={() => setPage("settings")}><IoMdSettings className="text-white" /></button>
      <div className="flex flex-col justify-center flex-wrap">
        <div className="">
          {
          userVal?.houses?.length > 0 ? 
          <>
            <hr />
                <SortItems />
                {
                  itemsList.length === 0 ? 
                  <div><Status type="success">Empty, add some items!</Status></div>
                  :
                  itemsList.map((item, index) => 
                    <div key={item._id} className="hover:bg-gray-100 transition-all dark:hover:bg-gray-700">
                      { sortByVal == "By department" && item.department != itemsList[index - 1]?.department ?
                        <p key={textColours[dupItemsList[index].colourCount % textColours.length]} className={`${textColours[dupItemsList[index].colourCount]} bold m-1`}>{item.department}</p>  
                        : 
                        ""
                    }
                    { sortByVal == "By person" && item.wantedBy != itemsList[index - 1]?.wantedBy ?
                        <p key={textColours[dupItemsList[index].colourCount % textColours.length]} className={`${textColours[dupItemsList[index].colourCount]} bold m-1`}>{item.wantedBy}</p>  
                        : 
                        ""
                    }
                    <div className={`border-solid border-l-8 dark:border-black  ${ sortByVal != "Default" && sortByVal != "" && colours[dupItemsList[index].colourCount % colours.length]}`}>
                      <div className="p-3 border-t-2 border-r-2 dark:border-black"  onClick={(e) => handleEdit(item._id, !item.completed, item.tempId ? item.tempId : false, e)}>
                        <div className="flex justify-between"> 
                          <div>
                            <input type="checkbox"  className="inline accent-green transform scale-150" onChange={(e) => handleEdit(item._id, e.target.checked, item.tempId ? item.tempId : false, e)} checked={item.completed} />
                            <div className={` ${item.completed ? "line-through inline" : "inline"} dark:decoration-white`}>
                                <span className="bold ml-3 dark:text-white ">{item.item}</span> 
                                <div>
                                  { sortByVal != "By department" && item.department != "" && item.department != "None" ? <> <span className="italic">in {item.department}</span> </> : ""}
                                  { sortByVal != "By person" && item.wantedBy != "" && item.wantedBy != "None" ? <> <span className="italic">by {item.wantedBy}</span> </> : ""}
                                  {/* { item.department != "" && item.department != "None" ? <> <span className="italic">in {item.department}</span> </> : ""}
                                  { item.wantedBy != "" && item.wantedBy != "None" ? <> <span className="italic">by {item.wantedBy}</span> </> : ""} */}
                                </div>
                            </div>
                          </div>
                          <button className="inline bold hover:bg-red-400 p-1 rounded transition-all dark:text-white" onClick={() => handleDelete(item._id, item.tempId)}><ImCross /></button>
                        </div>
                      </div> 
                    </div>
                    </div>
                  )
                }
                <hr />
              <ItemSettings itemsList={itemsList} setItemsList={setItemsList} />
          </>
          : 
            <Status type={"success"}>Welcome! First, head over to <button className="italic underline" onClick={() => setPage("Settings")}>Settings</button> to join a house</Status>
          }
        </div>
      </div>

    </div>
  )
}

export default Home;