import React from 'react'
import { HiPlus } from "react-icons/hi";

const InputAdd = (props) => {
  return (
    <div className="flex">
      <input className={`border inline flex-1 rounded-l-lg p-1 placeholder-black ${props.className}`} type={props.type} placeholder={props.placeholder} value={props.value} onChange={props.onChange} onKeyDown={props.onKeyDown}/>
      <button onClick={props.onClick} className="inline text-white border p-1 pr-2 bg-white !text-green font-extrabold rounded-r-xl"><HiPlus className="transform scale-125" /></button>
    </div>
  )
}

export default InputAdd