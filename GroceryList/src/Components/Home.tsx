import React, { useContext, useEffect, useState } from 'react'
import AddItem from './AddItem'
import '../css/Home.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ManageLists from './ManageLists'
import { Context } from '../App'
import ManageHouses from './ManageHouses'
import SortItems from './SortItems'

function Home({setPage}) {

  const queryClient = useQueryClient()


  // const updateMutation = useMutation({
  //   mutationFn: fetchUpdateQuery,
  //   onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["getQuery"]})
  //   }
  // });
  


  const [itemsList, setItemsList] = useState<Array<any>>([]);
  const {user, lists, selectedList, selectedHouse, sortBy, order} = useContext(Context);

  const [listsVal, setListsVal] = lists;
  const [selectedListVal, setSelectedListVal] = selectedList;
  const [userVal, setUserVal] = user;
  const [selectedHouseVal, setSelectedHouseVal] = selectedHouse; 
  const [sortByVal, setSortByVal] = sortBy; 
  const [orderVal, setOrderVal] = order;

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
  })

  useEffect(() => {
    if (status == "success") {
      const tempItems = [...items];
      setItemsList(tempItems.reverse())
    }
  }, [items, status])

 

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

  const fetchUpdateQuery = async ({id, checked}) => {
    console.log(checked);
    const listId = listsVal.filter(list => list.name == selectedListVal)[0]._id;
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/items/${id}`, {
          method: 'put',
          headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ 
              completed: checked,
              apartOfList: listId
            })
            }
          );
      return req.json();
  }

  const deleteMutation = useMutation({
    mutationFn: fetchDeleteQuery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getQuery"]})
    }
  });
  
  const handleEdit = (id, checked) => {
    updateMutation.mutate({ id: id, checked: checked });
  }

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  }

  //////////////////////////////////////

  const updateLocal = (
      id: string,
      completed: boolean
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
      updateLocal(payload.id, payload.checked);
    },
    onSuccess: (data) => {
      updateLocal(data.id, data.completed);
        // queryClient.invalidateQueries({ queryKey: ["getQuery"]})
    }
  });


  //////////////////////////////////////

  useEffect(() => {
    queryClient.invalidateQueries({queryKey: ["getQuery"]});
  }, [selectedListVal])

  const dateFromObjectId = function (objectId) {
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
  };

  const refreshSort = (itemsList) => {
    if (sortByVal == "Department") {
      itemsList.sort((a, b) => a.department > b.department ? 1 : -1)
    } else if (sortByVal == "Person") {
      itemsList.sort((a, b) => a.wantedBy > b.wantedBy ? 1 : -1)
    } else {
      itemsList.sort((a, b) => dateFromObjectId(a._id) > dateFromObjectId(b._id) ? 1 : -1)
    }

    if (orderVal == "Descending") {
      itemsList.reverse();
    }

    return itemsList;
  }
    
  useEffect(() => {
    if (status == "success") {
      const tempItemsList = [...itemsList];
      refreshSort(tempItemsList);
      setItemsList(tempItemsList);
    }
  }, [sortByVal, orderVal])


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
          {
            itemsList.length === 0 ? 
            <div><h2>Empty!</h2></div>
            :
            itemsList.map(item => 
              <div className="item" key={item._id}>
                <p className="itemContent"> 
                  <input type="checkbox" onChange={(e) => handleEdit(item._id, e.target.checked)} checked={item.completed} />
                  <span className="bold">{item.item}</span>
                    {item.department != "" && item.department != "None" ? <> <span className="em">in</span> {item.department}</> : ""}
                    {item.wantedBy != "" && item.wantedBy != "None" ? <> <span className="em">by</span> {item.wantedBy}</> : ""}
                  <button onClick={() => handleDelete(item._id)}>X</button>
                </p>
              </div> 
            )
          }
        </>
        : 
          <p>Welcome! First, head over to Settings to join a house</p>
        }
    </div>
  )
}

export default Home;