import React, { useContext, useEffect, useState } from 'react'
import AddItem from './AddItem'
import '../css/Home.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ManageLists from './ManageLists'
import { Context } from '../App'
import ManageHouses from './ManageHouses'

function Home({setPage}) {

  const queryClient = useQueryClient()


  // const updateMutation = useMutation({
  //   mutationFn: fetchUpdateQuery,
  //   onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["getQuery"]})
  //   }
  // });
  


  const [itemsList, setItemsList] = useState<Array<any>>([]);
  const {user, lists, selectedList, selectedHouse} = useContext(Context);

  const [listsVal, setListsVal] = lists;
  const [selectedListVal, setSelectedListVal] = selectedList;
  const [userVal, setUserVal] = user;
  const [selectedHouseVal, setSelectedHouseVal] = selectedHouse; 

  const fetchGetQuery = async () => {
    const listId = listsVal.filter((list) => list == selectedListVal)[0]._id;
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/items/${listId}`, {
      credentials: "include",
    })
    return req.json();
  }

  const {data: items, status} = useQuery({
    queryFn: fetchGetQuery,
    queryKey: ["getQuery"],
    enabled: selectedListVal != ""
  })

  useEffect(() => {
    status == "success" && setItemsList(items)
  }, [items])

 

  const fetchDeleteQuery = async (id : string) => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/items/${id}`, {
            method: 'delete',
            credentials: "include",
          });
      return req.json();
  }

  const fetchUpdateQuery = async ({id, checked}) => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/items/${id}`, {
          method: 'put',
          headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ 
              completed: checked 
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
  
  const handleEdit = (id, e) => {
    updateMutation.mutate({ id: id, checked: e.target.value });
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
          {
            itemsList.length === 0 ? 
            <div><h2>Empty!</h2></div>
            :
            itemsList.map(item => 
              <div className="item" key={item._id}>
                <input type="checkbox" onClick={(e) => handleEdit(item._id, e)} checked={item.completed} readOnly/>
                <p className="itemContent"> <span className="bold">{item.item}</span>
                  {item.department != "" ? <> <span className="em">in</span> {item.department}</> : ""}
                  {item.wantedBy != "" ? <> <span className="em">by</span> {item.wantedBy}</> : ""}
                </p>
                <button onClick={() => handleDelete(item._id)}>X</button>
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