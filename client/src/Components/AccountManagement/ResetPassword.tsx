import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import InputText from "../InputText";
import Button from "../Button";

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
    <div className="mt-3">
      <h4 className="bold">Change password</h4>
      <InputText type="text" placeholder='Old password' value={oldPwd} onChange={(e) => setOldPwd(e.target.value)}/>
      <InputText type="text" placeholder='New password' value={newPwd} onChange={(e) => setNewPwd(e.target.value)}/>
      <p>{status}</p>
      <Button className="!mx-0 my-1" onClick={handleChange}>Change</Button>
    </div>
  )
}

export default ResetPassword;