import React, { useContext, useEffect } from 'react'
import { Context } from "../AppWrapper"
import { useQuery } from "@tanstack/react-query";

// select list dropdown
const SelectListCustom = (props) => {

  return (
    <div>
      <select className="bg-greenDark rounded-xl text-white p-1 mr-3 bold" value={props.value} onChange={props.setFn}>
        { props.defaultVal ? 
          <option>{props.defaultVal}</option>
          : ""
        }
      { props.listVal.constructor === Array && props.listVal.map(props.listFn) }
      { props.addDefault && props.listVal.constructor === Array && props.listVal.length == 0 ? <option>No lists</option>: ""}
      </select>
    </div>
  )
}

export default SelectListCustom