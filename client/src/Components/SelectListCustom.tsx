import React, { useContext, useEffect } from 'react'
import { Context } from "../AppWrapper"
import { useQuery } from "@tanstack/react-query";

const SelectListCustom = (props) => {

  return (
    <div>
      <select className="bg-greenDark rounded-xl text-white p-1 mr-3 bold" value={props.value} onChange={props.setFn}>
      <option>{props.defaultVal}</option>
      { props.listVal.constructor === Array && props.listVal.map(props.listFn) }
      </select>
    </div>
  )
}

export default SelectListCustom