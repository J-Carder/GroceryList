import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'

const ResetPassword = () => {

  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [status, setStatus] = useState("");

  const passwordChangeMutation = useMutation({
    mutationFn: async () => {
      const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/users/password`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          oldPassword: oldPwd,
          newPassword: newPwd
        })
      })
      return req.json();
    },
    onSuccess: (data) => {
      if (data.msg == "Password changed") {
        setOldPwd("");
        setNewPwd("");
        setStatus("Password changed")
      } else {
        setStatus("Error");
      }
    }
  })

  const handleChange = () => {
    passwordChangeMutation.mutate();
  }

  return (
    <div>
      <h4>Change password</h4>
      <input type="text" placeholder='Old password' value={oldPwd} onChange={(e) => setOldPwd(e.target.value)}/>
      <input type="text" placeholder='New password' value={newPwd} onChange={(e) => setNewPwd(e.target.value)}/>
      <p>{status}</p>
      <button onClick={handleChange}>Change password</button>
    </div>
  )
}

export default ResetPassword;