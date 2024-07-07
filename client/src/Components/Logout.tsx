import { useMutation } from '@tanstack/react-query'
import React, { useContext, useEffect } from 'react'
import { Context } from '../AppWrapper'
import Button from "./Button";

const Logout = () => {

  const {authenticated, user} = useContext(Context);

  const [authVal, setAuthVal] = authenticated;
  const [userVal, setUserVal] = user;

  const fetchLogoutQuery = async () => {
    const logoutReq = await fetch(`${import.meta.env.VITE_REACT_APP_API}/logout`, {
      method: "delete",
      credentials: "include"
    })
    return logoutReq.json();
  }

  const logoutMutation = useMutation({
    mutationFn: fetchLogoutQuery,
    onSettled: () => {
      setAuthVal(false);
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate();
  }

  return (
    <div>
      <Button onClick={handleLogout}>
        Logout
      </Button>
    </div>
  )
}

export default Logout