import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'

const AdminOptions = () => {
  const [selectedEmail, setSelectedEmail] = useState("");
  const [emails, setEmails] = useState<Array<any>>([]);
  const [newPwd, setNewPwd] = useState("");
  const [status, setStatus] = useState("");
  const [deleteForReal, setDeleteForReal] = useState(false);
  const queryClient = useQueryClient();

  const getUsersQuery = useQuery({
    queryFn: async () => {
      const data = await fetch(`${import.meta.env.VITE_REACT_APP_API}/users`, 
        {
          credentials: "include",
        }
      )
      return data.json();
    },
    queryKey: ["getUsersQuery"]
  })

  const passwordChangeMutation = useMutation({
    mutationFn: async () => {
      const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/users/adminPassword`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          newPassword: newPwd,
          email: selectedEmail
        })
      })
      return req.json();
    },
    onSuccess: (data) => {
      if (data.msg == "Password changed") {
        setNewPwd("");
        setStatus("Password changed")
      } else {
        setStatus("Error");
      }
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const req = await fetch(`${import.meta.env.VITE_REACT_APP_API}/users`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: selectedEmail
        })
      })
      return req.json();
    },
    onSuccess: (data) => {
      if (data.msg == "Success") {
        setStatus("Delete successful")
        queryClient.invalidateQueries({queryKey: ["getUsersQuery"]})
        try {
          setSelectedEmail(emails[0].email);
        } catch (e) {
          setSelectedEmail("");
        }
      } else {
        setStatus("Delete unsuccessful")
      }
      setDeleteForReal(false);
    }
  })

  const handleChange = () => {
    passwordChangeMutation.mutate();
  }

  const handleDelete = () => {
    if (deleteForReal) {
      deleteMutation.mutate();
    }
    setDeleteForReal(true);
  }

  useEffect(() => {
    getUsersQuery.isSuccess && setEmails(getUsersQuery.data); 
  }, [getUsersQuery.data, getUsersQuery.isSuccess])

  return (
    <div>
      <h4>Change password</h4>
      <select value={selectedEmail} onChange={(e) => setSelectedEmail(e.target.value)}>
        {emails.map(e => <option key={e.email}>{e.email}</option>)}
      </select>
      <input type="text" placeholder='New password' value={newPwd} onChange={(e) => setNewPwd(e.target.value)}/>
      <p>{status}</p>
      <button onClick={handleChange}>Change password</button>
      <button onClick={handleDelete}>{ deleteForReal ? "DELETE USER for real?" : "Delete user"}</button>
    </div>
  )
}

export default AdminOptions;