import React, { useContext, useEffect, useState } from 'react';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Context } from '../AppWrapper';
import InputText from "./../Components/InputText";
import Button from "./../Components/Button";
import Status from "./../Components/Status";
import { ImSpinner2 } from "react-icons/im";

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
  const [status, setStatus] = useState("");

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
    },
    onError: (e) => {
      setStatus("Incorrect password or email");
    }
  }) 

  const registerMutation = useMutation({
    mutationFn: fetchRegisterQuery,
    onSuccess: (data) => {
      if (data.msg == "Registered new user") {
        setIsLogin(true);
      } else {
        setStatus(data.msg);
      }
        // queryClient.invalidateQueries({ queryKey: [""]})
    },
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
    if (!(registerPwd == registerPwdConfirm)) {
      setStatus("Passwords don't match"); 
      return;
    }
    registerMutation.mutate();
  }

  return (
    <div className="w-full">
      <div className="bg-green">
        <h1 className="text-white bold text-2xl text-center py-4">Login</h1>
      </div>

      <div className="p-3 flex flex-col content-center flex-wrap w-full">
        <div className="sm:w-[640px]">
          { isLogin ?
            <p className="italic">Need an account? <button className="inline italic underline" onClick={() => {setIsLogin(false); setStatus("")}}>Register</button></p>
              :
            <p className="italic">Already have an account? <button className="inline italic underline" onClick={() => {setIsLogin(true); setStatus("")}}>Login</button></p>
          }
          <form onSubmit={(e) => {e.preventDefault(); isLogin ? handleLogin() : handleRegister()}}>
            {isLogin ? 
            <>
              <InputText required={true} type="email" placeholder="email" value={loginEmail} onChange={(e) => {setLoginEmail(e.target.value)}}/>
              <InputText required={true} type="password" placeholder="password" value={loginPwd} onChange={(e) => {setLoginPwd(e.target.value)}}/>
              <Status>{status}</Status>
              <Button submit={true}>Login { loginMutation.isPending ? <ImSpinner2 className="inline animate-spin" /> : ""}</Button>
            </>
            :
            <>
              <InputText minLength={1} maxLength={100} required={true} type="text" placeholder="Name" value={registerName} onChange={(e) => {setRegisterName(e.target.value)}}/>
              <InputText minLength={1} maxLength={100} required={true} type="email" placeholder="Email" value={registerEmail} onChange={(e) => {setRegisterEmail(e.target.value)}}/>
              <InputText minLength={5} maxLength={100} required={true} type="password" placeholder="Password" value={registerPwd} onChange={(e) => {setRegisterPwd(e.target.value)}}/>
              <InputText minLength={5} maxLength={100} required={true} type="password" placeholder="Password again" value={registerPwdConfirm} onChange={(e) => {setRegisterPwdConfirm(e.target.value)}}/>
              <Status>{status}</Status>
              <Button submit={true}>Register { registerMutation.isPending ? <ImSpinner2 className="inline animate-spin" /> : ""} </Button>
            </>
            }
          </form>
        </div>
      </div>
      
    </div>
  )
}

export default Authenticate;