import React, { useContext, useEffect, useState } from 'react';
import Home from "./Pages/Home";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Settings from "./Pages/Settings";
import Authenticate from './Pages/Authenticate';
import { Context } from './AppWrapper';
import Splash from './Pages/Splash';



function App() {

  const queryClient = useQueryClient();
  const [page, setPage] = useState("home"); 
  const {online, authenticated, user, selectedHouse, selectedList, darkTheme} = useContext(Context);

  const [onlineVal, setOnlineVal] = online;
  const [authenticatedVal, setAuthenticatedVal] = authenticated;
  const [userVal, setUserVal] = user;
  const [selectedHouseVal, setSelectedHouseVal] = selectedHouse;
  const [selectedListVal, setSelectedListVal] = selectedList;
  const [darkThemeVal, setDarkThemeVal] = darkTheme;

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


  // run each time auth query changed
  useEffect(() => {
    // if authed set auth val and user information from isAuthQuery
    if (isAuthQuery.isSuccess && isAuthQuery.data.msg == "Authenticated") {
      setAuthenticatedVal(true);
      setUserVal(isAuthQuery.data.user)

      // try to set the selected house
      try {
        setSelectedHouseVal(isAuthQuery.data.user.houses[0]) 
      } catch (e) {
        setSelectedHouseVal("") 
      }
    } else {
      setAuthenticatedVal(false);
    }
  }, [isAuthQuery.isSuccess])


  // run the auth query each time at start/refresh
  useEffect(() => {
    queryClient.invalidateQueries({queryKey: ["isAuthQuery"]});
  }, [])


  // only run splash screen if not found in local storage, ideally only once
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("runOnce")!)) {
      setSplash(false);
    } else {
      setSplash(true);
      localStorage.setItem("runOnce", JSON.stringify(true));
    }
  }, []);

  return (
    <div className={`${darkThemeVal ? "dark" : ""} h-full dark:bg-gray-900`}>

      {/* {
        darkThemeVal ?
          <FaSun className="absolute top-4 left-6 text-white cursor-pointer" onClick={() => setDarkThemeVal(false)}/>
        :
          <FaMoon className="absolute top-4 left-6 text-white cursor-pointer" onClick={() => setDarkThemeVal(true)} />
      } */}

      { !onlineVal ? 
        <div className="text-red-500 text-center bg-red-300">
          <p>Offline, no connection!</p>
        </div>
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
