import React, { useContext, useEffect, useState } from 'react';
import Home from "./Components/Home";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Settings from "./Components/Settings";
import Authenticate from './Components/Authenticate';
import Logout from './Components/Logout';
import "./css/App.css"
import { Context } from './AppWrapper';
import WS from './Components/WS';

function App() {

  const queryClient = useQueryClient();
  const [page, setPage] = useState("home");
  const {online, authenticated, user, selectedHouse, selectedList} = useContext(Context);

  const [onlineVal, setOnlineVal] = online;
  const [authenticatedVal, setAuthenticatedVal] = authenticated;
  const [userVal, setUserVal] = user;
  const [selectedHouseVal, setSelectedHouseVal] = selectedHouse;
  const [selectedListVal, setSelectedListVal] = selectedList;


  const fetchIsAuthQuery = async () => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/authenticated`, {
          credentials: "include",
        });
    return req.json();
  }

  const isAuthQuery = useQuery({
    queryFn: fetchIsAuthQuery,
    queryKey: ["isAuthQuery"],
    // staleTime: Infinity,
    // gcTime: Infinity
  })

  useEffect(() => {
    // setAuthenticatedVal(getLocalLogin())
    if (isAuthQuery.isSuccess && isAuthQuery.data.msg == "Authenticated") {
      console.log("IS AUTHED")
      setAuthenticatedVal(true)
      setUserVal(isAuthQuery.data.user)
      try {
        setSelectedHouseVal(isAuthQuery.data.user.houses[0]) 
      } catch (e) {
        setSelectedHouseVal("") 
      }
    }
  }, [isAuthQuery.isSuccess])

  const setLocalLogin = (loggedIn : boolean) => {
    localStorage.setItem('auth', JSON.stringify(loggedIn));
  }

  const getLocalLogin = () => JSON.parse(localStorage.getItem('auth')!);

  useEffect(() => {
    console.log('invalidating...');
    queryClient.invalidateQueries({queryKey: ["isAuthQuery"]});
  }, [])

  // DEBUG
  useEffect(() => {
    console.log(authenticatedVal);
  })

  return (
    <div>
      { !onlineVal ? 
        <p>
          <span className='red'>OFFLINE</span>
        </p>
      : 
        ""
      }
      { authenticatedVal ? 
        <Logout />
      :
        ""
      }
      {
        !authenticatedVal ?
      <Authenticate setPage={setPage} />
      : 
        page == "home" ?
          <Home setPage={setPage} /> 
        :
          <Settings setPage={setPage} />
      }
      <button onClick={async () => {
        const data = await fetch(`${import.meta.env.VITE_REACT_APP_API}/socket`);
        const d = await data.text();
        console.log("rooms", d);
      }}>
        DEBUG
      </button>
      <WS />
    </div>
  )
}

export default App;
