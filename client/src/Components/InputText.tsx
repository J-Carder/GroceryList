import React from 'react'

// simple input component
const InputText = props => {
  return (
    <input required={props.required} maxLength={props.maxLength} minLength={props.minLength} className={`border rounded-lg p-1 placeholder-black w-full mt-1 ${props.className}`} type={props.type} placeholder={props.placeholder} value={props.value} onChange={props.onChange} onKeyDown={props.onKeyDown}/>
  )
}

export default InputText