import React, { useContext } from 'react'
import ManageDepts from './../Components/ManageDepts'
import ManagePeople from './../Components/ManagePeople'
import ManageHouses from './../Components/ManageHouses'
import { Context } from '../AppWrapper'
import ManageAccount from './../Components/ManageAccount'
import Logout from "./../Components/Logout"
import ManageLists from "./../Components/ManageLists"
import { IoHomeSharp } from "react-icons/io5";
import Status from '../Components/Status'


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
        <p>Jeremy Carder &copy; 2024</p>
      </div>
    </div>
  )
}

export default Settings