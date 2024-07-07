import React from 'react'

const Status = props => {
  return (
    props.children == "" ?
      ""
        :
    <div className={`border rounded-xl p-2 my-2 ${props.type == "success" ? "border-gray-300  bg-gray-200" : "border-red-300  bg-red-200"}`}>
        <p className="italic">{props.children}</p>
    </div>
  )
}

export default Status;