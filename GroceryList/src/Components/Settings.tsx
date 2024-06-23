import React, { useContext } from 'react'
import ManageDepts from './ManageDepts'
import ManagePeople from './ManagePeople'
import ManageHouses from './ManageHouses'
import ManageLists from './ManageLists'
import { Context } from '../App'
import ManageAccount from './ManageAccount'

function Settings({setPage}) {

  const {user} = useContext(Context);

  const [userVal, setUserVal] = user;

  return (
    <div>
      <h1>Settings</h1>
      <button onClick={() => setPage("home")}>Home</button>
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
    </div>
  )
}

export default Settings