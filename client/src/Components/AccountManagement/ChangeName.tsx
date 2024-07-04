import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useContext, useState } from 'react'
import { Context } from '../../AppWrapper';

const ChangeName = () => {

  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const {user} = useContext(Context);

  const [userVal, setUserVal] = user;

  const nameChangeMutation = useMutation({
    mutationFn: async () => {
      const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/users/name`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: name
        })
      })
      return req.json();
    },
    onSuccess: (data) => {
      if (data.msg != "Error") {
        setUserVal(userVal => {return {...userVal, name: name}})
        setName("");
      } else {
        console.log("error");
      }
    }
  })

  const handleChange = () => {
    nameChangeMutation.mutate();
  }

  return (
    <div>
      <h4>Change name</h4>
      <input type="text" placeholder='New name' value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleChange}>Change</button>
    </div>
  )
}

export default ChangeName;