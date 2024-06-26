import React, { useContext } from 'react'
import { Context } from '../AppWrapper';

const SortItems = () => {

  const {sortBy, order} = useContext(Context);

  const [sortByVal, setSortByVal] = sortBy;
  const [orderVal, setOrderVal] = order;

  return (
    <div>
      <h4>Sort items by:</h4>
      <select value={sortByVal} onChange={(e) => setSortByVal(e.target.value)}>
        <option>Default</option>
        <option>Department</option>
        <option>Person</option>
      </select>
      <button onClick={() => setOrderVal(orderVal == "Descending" ? "Ascending" : "Descending")}>{orderVal}</button>
    </div>
  )
}

export default SortItems;