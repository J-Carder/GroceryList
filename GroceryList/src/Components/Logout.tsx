import { useMutation } from '@tanstack/react-query'
import React, { useContext } from 'react'
import { Context } from '../App'

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
    onSuccess: (data) => {
      if (data.msg == "Logged out") {
        console.log("test")
        setAuthVal(false);
      }
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate();
  }

  return (
    <div>
      <div>
        <p>Hi, {userVal.name}</p>
      </div>
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}

export default Logout