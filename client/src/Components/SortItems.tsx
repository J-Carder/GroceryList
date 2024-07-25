import React, { useContext } from 'react'
import { Context } from '../AppWrapper';
import { TbSortAscending } from "react-icons/tb";
import { TbSortDescending } from "react-icons/tb";

// sort items dropdown
const SortItems = () => {

  const {sortBy, order} = useContext(Context);

  const [sortByVal, setSortByVal] = sortBy;
  const [orderVal, setOrderVal] = order;

  return (
    <div className="flex justify-center mb-4">
      <select className="rounded-xl bg-gray-200 p-1 mt-2" value={sortByVal} onChange={(e) => setSortByVal(e.target.value)}>
        <option>Default</option>
        <option>By department</option>
        <option>By person</option>
      </select>
      <button className="mt-2 ml-2" onClick={() => setOrderVal(orderVal == "Descending" ? "Ascending" : "Descending")}>{orderVal == "Descending" ? <TbSortDescending className="transform scale-150"/> : <TbSortAscending className="transform scale-150" /> }</button>
    </div>
  )
}

export default SortItems;