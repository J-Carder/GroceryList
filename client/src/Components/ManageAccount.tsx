import React, { useContext } from 'react'
import ChangeEmail from './AccountManagement/ChangeEmail';
import ResetPassword from './AccountManagement/ResetPassword';
import ChangeName from './AccountManagement/ChangeName';
import { Context } from '../AppWrapper';
import AdminOptions from './AccountManagement/AdminOptions';

// account managment
const ManageAccount = () => {

  const {user} = useContext(Context);

  const [userVal, setUserVal] = user;

  return (
    <div className="mt-3">
      <h3 className="bold">Manage Account</h3>
      <ChangeName />
      <ChangeEmail />
      <ResetPassword />
      {
        userVal.admin ?
          <AdminOptions />
        : 
          ""
      }
    </div>
  )
}

export default ManageAccount;