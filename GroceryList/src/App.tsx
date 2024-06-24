import React, { useState } from 'react';
import Home from "./Components/Home";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Settings from "./Components/Settings";
import Authenticate from './Components/Authenticate';
import Logout from './Components/Logout';


const queryClient = new QueryClient();

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
}

export const Context = React.createContext<Props>({} as Props);

function App() {

  const [page, setPage] = useState("home");
  const [personSelected, setPersonSelected] = useState("");
  const [departmentSelected, setDepartmentSelected] = useState("");
  const [personList, setPersonList] = useState<Array<any>>([]);
  const [departmentList, setDepartmentList] = useState<Array<any>>([]);
  const [selectedList, setSelectedList] = useState("");
  const [user, setUser] = useState<Object<any>>({});
  const [authenticated, setAuthenticated] = useState(false);
  const [lists, setLists] = useState<Array<any>>([]);
  const [selectedHouse, setSelectedHouse] = useState("");

  return (
    <Context.Provider value={{ selectedHouse: [selectedHouse, setSelectedHouse], lists: [lists, setLists], personSelected: [personSelected, setPersonSelected], personList: [personList, setPersonList], departmentSelected: [departmentSelected, setDepartmentSelected], departmentList: [departmentList, setDepartmentList], selectedList: [selectedList, setSelectedList], user: [user, setUser], authenticated: [authenticated, setAuthenticated]}}>
      <QueryClientProvider client={queryClient}>
        { authenticated ? 
          <Logout />
        :
          ""
        }
        {
          !authenticated ?
        <Authenticate setPage={setPage} />
        : 
          page == "home" ?
            <Home setPage={setPage} /> 
          :
            <Settings setPage={setPage} />
        }
        <button onClick={(e) =>
          console.log(selectedHouse)
        }>
          TESTER
        </button>
      </QueryClientProvider>
    </Context.Provider>
  )
}

export default App
