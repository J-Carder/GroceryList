import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useContext } from 'react'
import { Context } from '../AppWrapper'

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
    <div>
      <h4>Selection</h4>
      <button onClick={handleClear}>Clear checked</button>
      <button onClick={handleAll}>Select all</button>
      <button onClick={handleNone}>Select none</button>
    </div>
  )
}

export default ItemSettings