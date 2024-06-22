import React, { useContext, useEffect, useState } from 'react';
import "../css/Auth.css";
import { useMutation, useQuery } from '@tanstack/react-query';
import { Context } from '../App';

const Authenticate = () => {
  const [isLogin, setIsLogin] = useState(false)

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPwd, setRegisterPwd] = useState("");
  const [registerPwdConfirm, setRegisterPwdConfirm] = useState("");

  const {user, authenticated} = useContext(Context);
  const [userVal, setUserVal] = user;
  const [authenticatedVal, setAuthenticatedVal] = authenticated;

  const fetchLoginQuery = async () => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/login`, {
            method: 'post',
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              email: loginEmail,
              password: loginPwd
            })
          });
      return req.json();
  }


  const fetchRegisterQuery = async () => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/register`, {
            method: 'post',
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              name: registerName,
              email: registerEmail,
              password: registerPwd
            })
          });
      return req.json();
  }

  const fetchIsAuthQuery = async () => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/authenticated`, {
          credentials: "include",
        });
    return req.json();
  }

  const isAuthQuery = useQuery({
    queryFn: fetchIsAuthQuery,
    queryKey: ["isAuthQuery"]
  })

  const loginMutation = useMutation({
    mutationFn: fetchLoginQuery,
    onSuccess: (data) => {
        if (data.msg == "Authenticated") {
          setAuthenticatedVal(true);
          setUserVal(data.user);
        }
        // queryClient.invalidateQueries({ queryKey: [""]})
    }
  }) 

  const registerMutation = useMutation({
    mutationFn: fetchRegisterQuery,
    onSuccess: (data) => {
      if (data.msg == "Registered new user") {
        setIsLogin(true);
      }
        // queryClient.invalidateQueries({ queryKey: [""]})
    }
  }) 

  useEffect(() => {
    isAuthQuery.isSuccess && isAuthQuery.data.msg == "Authenticated" && setAuthenticatedVal(true)
    isAuthQuery.isSuccess && isAuthQuery.data.msg == "Authenticated" && setUserVal(isAuthQuery.data.user)
  }, [isAuthQuery.isSuccess])

  const handleLogin = () => {
    loginMutation.mutate();
  }

  const handleRegister = () => {
    console.log(registerEmail, registerName, registerPwd)
    registerMutation.mutate();
  }

  return (
    <div>
      <h1>Welcome to the Grocery List App</h1>
      <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Create an account?" : "Log in to existing account"}</button>

      {isLogin ? 
      <>
        <input type="text" placeholder="email" value={loginEmail} onChange={(e) => {setLoginEmail(e.target.value)}}/>
        <input type="text" placeholder="password" value={loginPwd} onChange={(e) => {setLoginPwd(e.target.value)}}/>
        <button onClick={handleLogin}>Login</button>
      </>
      :
      <>
        <input type="text" placeholder="name" value={registerName} onChange={(e) => {setRegisterName(e.target.value)}}/>
        <input type="email" placeholder="email" value={registerEmail} onChange={(e) => {setRegisterEmail(e.target.value)}}/>
        <input type="text" placeholder="password" value={registerPwd} onChange={(e) => {setRegisterPwd(e.target.value)}}/>
        <input type="text" placeholder="password again" value={registerPwdConfirm} onChange={(e) => {setRegisterPwdConfirm(e.target.value)}}/>
        <button onClick={handleRegister}>Register</button>
      </>
      }
    </div>
  )
}

export default Authenticate