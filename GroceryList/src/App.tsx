import React, { useContext, useEffect, useState } from 'react';
import Home from "./Components/Home";
import {QueryClient, useMutation, useQueryClient} from "@tanstack/react-query";
import Settings from "./Components/Settings";
import Authenticate from './Components/Authenticate';
import Logout from './Components/Logout';
import "./css/App.css"
import { Context } from './AppWrapper';

function App() {

  const queryClient = useQueryClient();
  const [page, setPage] = useState("home");
  const {online, offlineState, authenticated, user} = useContext(Context);

  const [onlineVal, setOnlineVal] = online;
  const [authenticatedVal, setAuthenticatedVal] = authenticated;
  const [userVal, setUserVal] = user;

  const offlineSync = useMutation({
    mutationFn: async (path, body) => {
      const req = await fetch(path, body);
      return req.json();
    }
  })


  // TODO: this
  const syncBackend = (offlineState) => {
    offlineState.map(async (item) => {
      offlineSync.mutate(item.path, item.body);
    })
  }

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
      <button onClick={() => {
        console.log(userVal, authenticatedVal)
      }}>
        DEBUG
      </button>
    </div>
  )
}

export default App;
