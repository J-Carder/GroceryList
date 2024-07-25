import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useContext, useState } from 'react'
import { Context } from '../../AppWrapper';
import InputText from "../InputText";
import Button from "../Button";
import Status from '../Status';

// change name component
const ChangeName = () => {

  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const {user} = useContext(Context);

  const [userVal, setUserVal] = user;
  const [status, setStatus] = useState("");

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
        setStatus(data.msg);
      }
    }
  })

  const handleChange = () => {
    nameChangeMutation.mutate();
  }

  return (
    <form onSubmit={(e) => {e.preventDefault(); handleChange()}}>
      <h4 className="bold">Change name</h4>
      <InputText required={true} type="text" placeholder='New name' value={name} onChange={(e) => setName(e.target.value)} />
      <Status>{status}</Status>
      <Button submit={true} className="!mx-0 my-1">Change</Button>
    </form>
  )
}

export default ChangeName;