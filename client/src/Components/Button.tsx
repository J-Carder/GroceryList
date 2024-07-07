import React from 'react'

const Button = props => {
  return (
    <button className={`text-white bg-gray-800 p-2 px-10 rounded-xl text-1xl m-4 w-fit mx-auto ${props.className}`} onClick={props.onClick}>{props.children}</button>
  )
}

export default Button