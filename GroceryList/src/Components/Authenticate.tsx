import React, { useContext, useState } from 'react';
import "../css/Auth.css";
import { useMutation } from '@tanstack/react-query';
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
            body: JSON.stringify({
              email: loginEmail,
              password: loginPwd
            })
          });
      return req.json();
  }


  const fetchRegisterQuery = async () => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/login`, {
            method: 'post',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: loginEmail,
              password: loginPwd
            })
          });
      return req.json();
  }

  const loginMutation = useMutation({
    mutationFn: fetchLoginQuery,
    onSuccess: (data) => {
        if (data.msg == "Authenticated") {
          setAuthenticatedVal(true);
          setUserVal(data.user)
        }
        // queryClient.invalidateQueries({ queryKey: [""]})
    }
  }) 

  const registerMutation = useMutation({
    mutationFn: fetchRegisterQuery,
    onSuccess: () => {
        // queryClient.invalidateQueries({ queryKey: [""]})
    }
  }) 

  const handleLogin = () => {
    loginMutation.mutate();
  }

  const handleRegister = () => {

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