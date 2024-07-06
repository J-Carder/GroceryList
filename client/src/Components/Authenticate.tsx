import React, { useContext, useEffect, useState } from 'react';
import "../css/Auth.css";
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Context } from '../AppWrapper';
import InputText from "./InputText";
import Button from "./Button";


const Authenticate = ({setPage}) => {
  
  const queryClient = useQueryClient();
  const [isLogin, setIsLogin] = useState(false)

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPwd, setRegisterPwd] = useState("");
  const [registerPwdConfirm, setRegisterPwdConfirm] = useState("");

  const {user, authenticated, selectedHouse} = useContext(Context);
  const [userVal, setUserVal] = user;
  const [authenticatedVal, setAuthenticatedVal] = authenticated;
  const [selectedHouseVal, setSelectedHouseVal] = selectedHouse;

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
            }),
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

  // const isAuthQuery = useQuery({
  //   queryFn: fetchIsAuthQuery,
  //   queryKey: ["isAuthQuery"],
  //   staleTime: Infinity,
  //   gcTime: Infinity
  // })

  const loginMutation = useMutation({
    mutationFn: fetchLoginQuery,
    onSuccess: (data) => {
        if (data.msg == "Authenticated") {
          console.log("AUTH NUMBA 2")
          setAuthenticatedVal(true);
          setUserVal(data.user);
          setPage("home");
          try {
            setSelectedHouseVal(data.user.houses[0]) 
          } catch (e) {
            setSelectedHouseVal("");
          }
        }
        setLocalLogin(true);
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

  // useEffect(() => {
  //   isAuthQuery.isSuccess && isAuthQuery.data.msg == "Authenticated" && setAuthenticatedVal(true)
  //   isAuthQuery.isSuccess && isAuthQuery.data.msg == "Authenticated" && setLocalLogin(true);
  //   isAuthQuery.isSuccess && isAuthQuery.data.msg == "Authenticated" && setUserVal(isAuthQuery.data.user)
  //   try {
  //     isAuthQuery.isSuccess && isAuthQuery.data.msg == "Authenticated" && setSelectedHouseVal(isAuthQuery.data.user.houses[0]) 
  //   } catch (e) {
  //     isAuthQuery.isSuccess && isAuthQuery.data.msg == "Authenticated" && setSelectedHouseVal("") 
  //   }
  // }, [isAuthQuery.isSuccess])

  const setLocalLogin = (loggedIn : boolean) => {
    localStorage.setItem('auth', JSON.stringify(loggedIn));
  }

  const getLocalLogin = () => JSON.parse(localStorage.getItem('auth')!);

  const handleLogin = () => {
    loginMutation.mutate();
  }

  const handleRegister = () => {
    registerMutation.mutate();
  }

  return (
    <div>
      <div className="bg-green">
        <h1 className="text-white bold text-2xl text-center py-4">Login</h1>
      </div>

      <div className="p-3">
        { isLogin ? 
          <p className="italic">Need an account? <button className="inline italic underline" onClick={() => setIsLogin(false)}>Register</button></p>
            :
          <p className="italic">Already have an account? <button className="inline italic underline" onClick={() => setIsLogin(true)}>Login</button></p>
        }

        {isLogin ? 
        <>
          <InputText type="text" placeholder="email" value={loginEmail} change={(e) => {setLoginEmail(e.target.value)}}/>
          <InputText type="text" placeholder="password" value={loginPwd} change={(e) => {setLoginPwd(e.target.value)}}/>
          <Button click={handleLogin}>Login</Button>
        </>
        :
        <>
          <InputText type="text" placeholder="Name" value={registerName} change={(e) => {setRegisterName(e.target.value)}}/>
          <InputText type="email" placeholder="Email" value={registerEmail} change={(e) => {setRegisterEmail(e.target.value)}}/>
          <InputText type="text" placeholder="Password" value={registerPwd} change={(e) => {setRegisterPwd(e.target.value)}}/>
          <InputText type="text" placeholder="Password again" value={registerPwdConfirm} change={(e) => {setRegisterPwdConfirm(e.target.value)}}/>
          <Button click={handleRegister}>Register</Button>
        </>
        }
      </div>
      
    </div>
  )
}

export default Authenticate;