import React, { useContext, useEffect } from 'react'
import { Context } from "../AppWrapper"
import { useQuery } from "@tanstack/react-query";

// select list
const SelectList = () => {

  const {lists, selectedList, user} = useContext(Context)

  const [listsVal, setListsVal] = lists;
  const [selectedListVal, setSelectedListVal] = selectedList;
  const [userVal, setUserVal] = user;

  const fetchGetQuery = async () => {
    const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/lists/${userVal.houses[0]}`, 
      {
        method: "get",
        credentials: "include"
      }
    )
    return req.json();
  }
  
  const getQuery = useQuery({
    queryFn: fetchGetQuery,
    queryKey: ["listGetQuery"]
  })

  useEffect(() => {
    getQuery.isSuccess && setListsVal(getQuery.data) ;
    try {
      getQuery.isSuccess && setSelectedListVal(getQuery.data[0].name);
    } catch (e) {
      setSelectedListVal("");
    }
  }, [getQuery.isSuccess, getQuery.data]);

  return (
    <div>
      <select className="bg-greenDark rounded-xl text-white p-1 bold" value={selectedListVal} onChange={(e) => setSelectedListVal(e.target.value)}>
      { listsVal.constructor === Array && listsVal.map(list => <option key={list._id}>{list.name}</option>) }
      </select>
    </div>
  )
}

export default SelectList