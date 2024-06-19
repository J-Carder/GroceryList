import React from 'react'
import ManageDepts from './ManageDepts'
import ManagePeople from './ManagePeople'

function Settings({setPage}) {
  return (
    <div>
      <h1>Settings</h1>
      <button onClick={() => setPage("home")}>Home</button>
      <h2>Manage Departments</h2>
      <ManageDepts />
      <h2>Manage People</h2>
      <ManagePeople />
    </div>
  )
}

export default Settings