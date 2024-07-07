import React, { useContext } from 'react'
import ManageDepts from './ManageDepts'
import ManagePeople from './ManagePeople'
import ManageHouses from './ManageHouses'
import { Context } from '../AppWrapper'
import ManageAccount from './ManageAccount'
import Logout from "./Logout"
import ManageLists from "./ManageLists"
import { IoHomeSharp } from "react-icons/io5";


function Settings({setPage}) {

  const {user} = useContext(Context);

  const [userVal, setUserVal] = user;

  return (
    <div>
      <div className="bg-green">
        <h1 className="text-white bold text-2xl text-center py-4">Settings</h1>
      </div>
      <button className="absolute top-4 right-5" onClick={() => setPage("home")}><IoHomeSharp className="text-white" /></button>
      <div className="p-3">
        <ManageHouses />
        <ManageLists />
        {
          userVal?.houses?.length > 0 ?
          <div>
            <ManageDepts />
            <ManagePeople />
          </div>
          :
          ""
        }
        <ManageAccount />
        <hr className="mt-5"/>
        <Logout />
      </div>
    </div>
  )
}

export default Settings