import React, { useState } from 'react';
import Home from './Home'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import Settings from './Settings';

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
        { page == "home" ?
          <Home setPage={setPage} /> 
        :
          <Settings setPage={setPage} />
        }
      </QueryClientProvider>
    </Context.Provider>
  )
}

export default App
