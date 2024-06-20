import React, { useState } from 'react';
import Home from "./Components/Home";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Settings from "./Components/Settings";
import Authenticate from './Components/Authenticate';


const queryClient = new QueryClient();

export const Context = React.createContext();

function App() {

  const [page, setPage] = useState("home");
  const [personSelected, setPersonSelected] = useState("")
  const [departmentSelected, setDepartmentSelected] = useState("")
  const [personList, setPersonList] = useState([])
  const [departmentList, setDepartmentList] = useState([])

  return (
    <Context.Provider value={{ personSelected: [personSelected, setPersonSelected], personList: [personList, setPersonList], departmentSelected: [departmentSelected, setDepartmentSelected], departmentList: [departmentList, setDepartmentList]}}>
      <QueryClientProvider client={queryClient}>
        <Authenticate />
        {/* { page == "home" ?
          <Home setPage={setPage} /> 
        :
          <Settings setPage={setPage} />
        } */}
      </QueryClientProvider>
    </Context.Provider>
  )
}

export default App
