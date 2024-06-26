import React, { useContext, useEffect, useState } from 'react';
import Home from "./Components/Home";
import {QueryClient, useMutation, useQueryClient} from "@tanstack/react-query";
import Settings from "./Components/Settings";
import Authenticate from './Components/Authenticate';
import Logout from './Components/Logout';
import "./css/App.css"
import { Context } from './AppWrapper';
import { PersistQueryClientProvider, persistQueryClientSave } from '@tanstack/react-query-persist-client';

function App() {

  const queryClient = useQueryClient();
  const [page, setPage] = useState("home");
  const {online, offlineState, authenticated} = useContext(Context);

  const [onlineVal, setOnlineVal] = online;
  const [offlineStateVal, setOfflineStateVal] = offlineState;
  const [authenticatedVal, setAuthenticatedVal] = authenticated;

  useEffect(()=>{
    window.addEventListener('online', function(e) {
      setOnlineVal(true);
    }, false);
     
    window.addEventListener('offline', function(e) {
      setOnlineVal(false);
    }, false);
  },[])


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


  useEffect(() => {
    if (onlineVal) {
      // syncBackend(offlineStateVal)
      // setOfflineStateVal([]);
    }
  }, [onlineVal])

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
    </div>
  )
}

export default App;
