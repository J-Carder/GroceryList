import React, { useEffect, useState } from 'react'
import App from './App'
import { QueryClient, QueryClientProvider, onlineManager } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import AsyncLocalStorage from '@createnextapp/async-local-storage'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';


// iniialize query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
      // networkMode: "offlineFirst",
      networkMode: "offlineFirst",
    }
  }
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncLocalStorage,
})

// should be more specific!
interface Props {
  personSelected: Array<any>
  departmentSelected: Array<any>
  authenticated: Array<any>
  personList: Array<any>
  departmentList: Array<any>
  selectedList: Array<any>
  user: Array<any>
  lists: Array<any>
  selectedHouse: Array<any>
  sortBy: Array<any>
  order: Array<any>
  online: Array<any>
  offlineState: Array<any>
  darkTheme: Array<any>
}

// context
export const Context = React.createContext<Props>({} as Props);


const AppWrapper = () => {

  const [personSelected, setPersonSelected] = useState("");
  const [departmentSelected, setDepartmentSelected] = useState("");
  const [personList, setPersonList] = useState<Array<any>>([]);
  const [departmentList, setDepartmentList] = useState<Array<any>>([]);
  const [selectedList, setSelectedList] = useState("");
  const [user, setUser] = useState<object>({});
  const [authenticated, setAuthenticated] = useState(false);
  const [lists, setLists] = useState<Array<any>>([]);
  const [selectedHouse, setSelectedHouse] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("Descending");
  const [online, setOnline] = useState(window.navigator.onLine);
  const [offlineState, setOfflineState] = useState<Array<any>>([]);
  // const [darkTheme, setDarkTheme] = useState(localStorage.getItem("darkTheme") === "true"); // <--- change to false
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(()=>{
    window.addEventListener('online', function(e) {
      setOnline(true);
    }, false);
     
    window.addEventListener('offline', function(e) {
      setOnline(false);
    }, false);
  },[])

  useEffect(() => {
    onlineManager.setOnline(online);
  }, [online])

  useEffect(() => {
    localStorage.setItem("darkTheme", darkTheme.toString());
  }, [darkTheme])


return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
      // onSuccess={() => {
      //   queryClient.resumePausedMutations()
      //   .then(() => queryClient.invalidateQueries())
      //   console.log("burh")
      // }}
    >
      <Context.Provider value={{ darkTheme: [darkTheme, setDarkTheme], offlineState: [offlineState, setOfflineState], online: [online, setOnline], order: [order, setOrder], sortBy: [sortBy, setSortBy], selectedHouse: [selectedHouse, setSelectedHouse], lists: [lists, setLists], personSelected: [personSelected, setPersonSelected], personList: [personList, setPersonList], departmentSelected: [departmentSelected, setDepartmentSelected], departmentList: [departmentList, setDepartmentList], selectedList: [selectedList, setSelectedList], user: [user, setUser], authenticated: [authenticated, setAuthenticated]}}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Context.Provider>
    </PersistQueryClientProvider>
  )
}

export default AppWrapper;