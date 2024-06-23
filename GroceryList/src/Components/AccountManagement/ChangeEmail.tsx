import { Query, useQueryClient } from '@tanstack/react-query';
import React from 'react'

const ChangeEmail = () => {

  const QueryClient = useQueryClient();

  return (
    <div>ChangeEmail
      {/* <button onClick={(e) => {
        QueryClient.invalidateQueries({queryKey: ["listGetQuery"], refetchType: "active"});
        console.log("test")
      }}>TEST BUTTON</button> */}
    </div>
  )
}

export default ChangeEmail;