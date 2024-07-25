import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import InputText from "../InputText";
import Button from "../Button";
import Status from '../Status';


// reset password component
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
        setStatus(data.msg);
      }
    }
  })

  const handleChange = () => {
    if (newPwd != oldPwd) {
      setStatus("Passwords don't match");
      return;
    }
    passwordChangeMutation.mutate();
  }

  return (
    <form className="mt-3" onSubmit={(e) => {e.preventDefault(); handleChange()}}>
      <h4 className="bold">Change password</h4>
      <InputText minLength={5} required={true} type="password" placeholder='Old password' value={oldPwd} onChange={(e) => setOldPwd(e.target.value)}/>
      <InputText minLength={5} required={true} type="password" placeholder='New password' value={newPwd} onChange={(e) => setNewPwd(e.target.value)}/>
      <Status>{status}</Status>
      <Button submit={true} className="!mx-0 my-1">Change</Button>
    </form>
  )
}

export default ResetPassword;