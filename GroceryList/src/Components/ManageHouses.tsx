import React from 'react'

const ManageHouses = () => {
  return (
    <div>
      <h3>Current house</h3>
      <select>

      </select>
      <h3>Add new house</h3>
      <div>
        <input type="text" placeholder="House name" />
        <input type="text" placeholder="Passphrase" />
        <button>Add</button>
      </div>

      <h3>Join a house</h3>
      <div>
        <input type="text" placeholder="House name" />
        <input type="text" placeholder="Passphrase" />
        <button>Join!</button> 
      </div>
    </div>
  )
}

export default ManageHouses