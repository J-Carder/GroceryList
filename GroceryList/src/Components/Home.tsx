import React, { useEffect, useState } from 'react'
import Create from './Create'
import '../css/Home.css'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const fetchGetQuery = async () => {
  const req = await fetch("http://localhost:3001/items")
  return req.json();
}

function Home({setPage}) {

  const queryClient = useQueryClient()

  const {data: items, status} = useQuery({
    queryFn: fetchGetQuery,
    queryKey: ["getQuery"]
  })
  
  const handleEdit = (id) => {

      (async () => {

        const req2 = await fetch("http://localhost:3001/items/" + id);
        const data2 = await req2.json()

        const req = await fetch("http://localhost:3001/items/" + id, 
        { 
        method: 'put',
        headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            completed: !data2.completed
           })
        }
      )
        const data = await req.json()

        queryClient.invalidateQueries({ queryKey: ["getQuery"] })
      })();

  }


  const handleDelete = (id) => {

      (async () => {
        const req = await fetch("http://localhost:3001/items/" + id, 
        { 
        method: 'delete',
        }
      )
        const data = await req.json()

        queryClient.invalidateQueries({ queryKey: ["getQuery"] })
      })();

  }

  if (status === "pending") {
    return <h1>loading</h1>
  }

  if (status === "error") {
    return <h1>error!</h1>
  }

  return (
    <div>
      <h2>Grocery List</h2>
      <button onClick={() => setPage("settings")}>Settings</button>
      <h3>List:</h3>
      <select name="list" id="list">
      </select>
      <Create />
      {
        items.length === 0 ? 
        <div><h2>Empty!</h2></div>
        :
        items.map(item => 
          <div className="item" key={item._id}>
            <input type="checkbox" onClick={() => handleEdit(item._id)} checked={item.completed} readOnly/>
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

export default Home