import { Query, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useContext, useState } from 'react'
import { Context } from '../../App';

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
        setStatus("Error")
      }
    }
  })

  const handleChange = () => {
    emailChangeMutation.mutate();
  }

  return (
    <div>

      {/* <button onClick={(e) => {
        QueryClient.invalidateQueries({queryKey: ["listGetQuery"], refetchType: "active"});
        console.log("test")
      }}>TEST BUTTON</button> */}

      <h4>Change Email</h4>
      <input type="text" placeholder='New email' value={email} onChange={(e) => setEmail(e.target.value)} />
      <p>{status}</p>
      <button onClick={handleChange}>Change</button>
    </div>
  )
}

export default ChangeEmail;