import { Query, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useContext, useState } from 'react'
import { Context } from '../../AppWrapper';
import InputText from "../InputText";
import Button from "../Button";
import Status from '../Status';

const ChangeEmail = () => {

  const QueryClient = useQueryClient();

  const [email, setEmail] = useState("");

  const {user} = useContext(Context);

  const [userVal, setUserVal] = user;
  const [status, setStatus] = useState("");

  const emailChangeMutation = useMutation({
    mutationFn: async () => {
      const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/users/email`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          newEmail: email
        })
      })
      return req.json();
    },
    onSuccess: (data) => {
      if (data.msg == "Email changed") {
        setUserVal(userVal => {return {...userVal, email: email}})
        setEmail("");
        setStatus("Changed")
      } else {
        setStatus(data.msg)
      }
    }
  })

  const handleChange = () => {
    emailChangeMutation.mutate();
  }

  return (
    <form className="mt-3" onSubmit={(e) => {e.preventDefault(); handleChange()}}>

      {/* <button onClick={(e) => {
        QueryClient.invalidateQueries({queryKey: ["listGetQuery"], refetchType: "active"});
        console.log("test")
      }}>TEST BUTTON</button> */}

      <h4 className="bold">Change Email</h4>
      <InputText required={true} type="email" placeholder='New email' value={email} onChange={(e) => setEmail(e.target.value)} />
      <Status>{status}</Status>
      <Button submit={true} className="!mx-0 my-1">Change</Button>
    </form>
  )
}

export default ChangeEmail;