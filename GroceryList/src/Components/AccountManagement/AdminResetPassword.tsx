import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'

const AdminResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [status, setStatus] = useState("");

  const passwordChangeMutation = useMutation({
    mutationFn: async () => {
      const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/users/adminPassword`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          newPassword: newPwd,
          email: email
        })
      })
      return req.json();
    },
    onSuccess: (data) => {
      if (data.msg == "Password changed") {
        setEmail("");
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
      <input type="text" placeholder='User email' value={email} onChange={(e) => setEmail(e.target.value)}/>
      <input type="text" placeholder='New password' value={newPwd} onChange={(e) => setNewPwd(e.target.value)}/>
      <p>{status}</p>
      <button onClick={handleChange}>Change password</button>
    </div>
  )
}

export default AdminResetPassword;