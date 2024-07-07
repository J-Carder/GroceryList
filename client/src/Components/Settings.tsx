import React, { useContext } from 'react'
import ManageDepts from './ManageDepts'
import ManagePeople from './ManagePeople'
import ManageHouses from './ManageHouses'
import { Context } from '../AppWrapper'
import ManageAccount from './ManageAccount'
import Logout from "./Logout"

function Settings({setPage}) {

  const {user} = useContext(Context);

  const [userVal, setUserVal] = user;

  return (
    <div>
      <div className="bg-green">
        <h1 className="text-white bold text-2xl text-center py-4">Settings</h1>
      </div>
      <button className="absolute top-5 right-3" onClick={() => setPage("home")}>Home</button>
      <div className="p-3">
        <ManageHouses />
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