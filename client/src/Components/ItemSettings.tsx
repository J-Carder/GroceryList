import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useContext } from 'react'
import { Context } from '../AppWrapper'

// select all/none and clear buttons
const ItemSettings = ({itemsList, setItemsList}) => {


  const {lists, selectedList} = useContext(Context);

  const [listsVal, setListsVal] = lists;
  const [selectedListVal, setSelectedListVal] = selectedList;

  const queryClient = useQueryClient();

  const fillLocal = (fill) => {
    queryClient.setQueryData(["getQuery"], (itemsListTemp : Array<any>) => {
      return itemsListTemp.map(item => {
        const tempItem = {...item};
        tempItem.completed = fill;
        return tempItem;
      })
    })
  }

  const fillQuery = useMutation({
    mutationFn: async (completed : boolean) => {

      const listId = listsVal.filter(list => list.name == selectedListVal)[0]._id;
      const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/items/fill`, {
              method: 'post',
              headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ 
                  completed: completed,
                  apartOfList: listId,
                })
                }
              );
      return req.json();
    },
    onSuccess: async () => {
      // queryClient.invalidateQueries({queryKey: ["getQuery"]})
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({queryKey: ["getQuery"]});
      fillLocal(payload);
    }
  })

  const clearLocal = () => {
    queryClient.setQueryData(["getQuery"], (itemsListTemp : Array<any>) => {
      return itemsListTemp.filter((item) => !item.completed);
    })
  }

  const clearQuery = useMutation({
    mutationFn: async () => {

      const listId = listsVal.filter(list => list.name == selectedListVal)[0]._id;
      const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/items/clear`, {
              method: 'post',
              headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ 
                  apartOfList: listId
                })
                }
              );
      return req.json();
    },
    onSuccess: async () => {
      // queryClient.invalidateQueries({queryKey: ["getQuery"]})
    },
    onMutate: async () => {
      await queryClient.cancelQueries({queryKey: ["getQuery"]});
      clearLocal();
    }
  })

  const handleClear = () => {
    clearQuery.mutate();
  }

  const handleAll = () => {
    fillQuery.mutate(true);
  }

  const handleNone = () => {
    fillQuery.mutate(false);
  }

  return (
    <div className="flex mt-3">
      <button className="bg-gray-200 p-1 px-2 rounded-xl bold ml-2" onClick={handleAll}>Select all</button>
      <button className="bg-gray-200 p-1 px-2 rounded-xl bold ml-2" onClick={handleNone}>Select none</button>
      <button className="bg-gray-200 p-1 px-2 rounded-xl bold ml-2" onClick={handleClear}>Clear checked</button>
    </div>
  )
}

export default ItemSettings