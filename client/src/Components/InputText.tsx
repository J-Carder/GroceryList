import React from 'react'

const InputText = props => {
  return (
    <input className="border rounded-lg p-1 placeholder-black w-full mt-1" type={props.type} placeholder={props.placeholder} value={props.value} onChange={props.onChange} onKeyDown={props.onKeyDown}/>
  )
}

export default InputText