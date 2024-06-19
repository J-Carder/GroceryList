import React, { useState } from 'react'

const ManageLists = () => {

  const [currentList, setCurrentList] = useState("");

  return (
    <div>
      <h3>Add new list</h3>
      <div>
        <input type="text" placeholder="List name" />
        <button>Add</button>
      </div>
    </div>
  )
}

export default ManageLists