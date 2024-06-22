import React, { useContext, useEffect, useState } from 'react'
import AddItem from './AddItem'
import '../css/Home.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ManageLists from './ManageLists'
import { Context } from '../App'

function Home({setPage}) {

  const queryClient = useQueryClient()


  // const updateMutation = useMutation({
  //   mutationFn: fetchUpdateQuery,
  //   onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["getQuery"]})
  //   }
  // });
  


  const [itemsList, setItemsList] = useState([]);
  const {selectedList} = useContext(Context);
  const [selectedListVal, setSelectedListVal] = selectedList;

  const fetchGetQuery = async () => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/items/${selectedListVal}`, {
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
      queryClient.setQueryData(['getQuery'], itemsList => {
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
      await queryClient.cancelQueries(["getQuery"]);
      updateLocal(payload.id, payload.completed);
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
      <h2>Grocery List</h2>
      <button onClick={() => setPage("settings")}>Settings</button>
      <ManageLists />
      <hr />
      <AddItem />
      {
        itemsList.length === 0 ? 
        <div><h2>Empty!</h2></div>
        :
        itemsList.map(item => 
          <div className="item" key={item._id}>
            <input type="checkbox" onClick={(e) => handleEdit(item._id, e.target.checked)} checked={item.completed} readOnly/>
            <p className="itemContent"> <span className="bold">{item.item}</span>
              {item.department != "" ? <> <span className="em">in</span> {item.department}</> : ""}
              {item.wantedBy != "" ? <> <span className="em">by</span> {item.wantedBy}</> : ""}
            </p>
            <button onClick={() => handleDelete(item._id)}>X</button>
          </div> 
        )
      }
    </div>
  )
}

export default Home;