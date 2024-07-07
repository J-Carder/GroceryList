import React from 'react'
import { ImCross } from "react-icons/im";

const XButtonText = props => {
  return (
    <div key={props.key} className="bg-gray-700 rounded-xl mt-2 mr-1 w-fit">
        <p className="text-white p-2">{props.children} <button className="inline bold" onClick={props.onClick}><ImCross className="text-white mt-1 ml-2"/></button></p>
    </div>
  )
}

export default XButtonText;