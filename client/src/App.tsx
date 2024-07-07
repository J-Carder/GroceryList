import React, { useContext, useEffect, useState } from 'react';
import Home from "./Pages/Home";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Settings from "./Pages/Settings";
import Authenticate from './Pages/Authenticate';
import Logout from './Components/Logout';
import { Context } from './AppWrapper';
import Splash from './Pages/Splash';

function App() {

  const queryClient = useQueryClient();
  const [page, setPage] = useState("home"); 
  const {online, authenticated, user, selectedHouse, selectedList} = useContext(Context);

  const [onlineVal, setOnlineVal] = online;
  const [authenticatedVal, setAuthenticatedVal] = authenticated;
  const [userVal, setUserVal] = user;
  const [selectedHouseVal, setSelectedHouseVal] = selectedHouse;
  const [selectedListVal, setSelectedListVal] = selectedList;
  const [splash, setSplash] = useState(false);


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
    queryClient.invalidateQueries({queryKey: ["isAuthQuery"]});
  }, [])

  useEffect(() => {
    console.log("splash =>", splash);
  })

  // only run splash if not found in local storage, ideally only once
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("runOnce")!)) {
      setSplash(false);
    } else {
      setSplash(true);
      localStorage.setItem("runOnce", JSON.stringify(true));
    }
  }, []);

  return (
    <div>
      { !onlineVal ? 
        <p>
          <span className='red'>OFFLINE</span>
        </p>
      : 
        ""
      }
      {
        !authenticatedVal ?
        splash ? 
        <Splash setSplash={setSplash} />
        :
        <Authenticate setPage={setPage} />
      : 
        page == "home" ?
          <Home setPage={setPage} /> 
        :
          <Settings setPage={setPage} />
      }
      {/* <button onClick={async () => {
        // const data = await fetch(`${import.meta.env.VITE_REACT_APP_API}/socket`);
        // const d = await data.text();
        // console.log("rooms", d);
        setAuthenticatedVal(!authenticatedVal);
      }}>
        Auth toggle
      </button>
      <button onClick={() =>{
        setSplash(!splash)
      }}>
        Splash toggle
      </button>
      <button onClick={() => console.log(authenticatedVal)}>
        console log
      </button>
      <WS /> */}
    </div>
  )
}

export default App;
