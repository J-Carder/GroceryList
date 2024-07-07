import React from 'react'

const XButtonText = props => {
  return (
    <div key={props.key} className="bg-gray-700 rounded-xl mt-2 w-fit">
        <p className="text-white p-2">{props.children} <button className="inline bold" onClick={props.onClick}>X</button></p>
    </div>
  )
}

export default XButtonText;