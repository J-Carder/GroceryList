import React from 'react'
import ChangeEmail from './AccountManagement/ChangeEmail';
import ResetPassword from './AccountManagement/ResetPassword';
import ChangeName from './AccountManagement/ChangeName';

const ManageAccount = () => {
  return (
    <div>
      <h3>Manage Account</h3>
      <ChangeName />
      <ChangeEmail />
      <ResetPassword />
    </div>
  )
}

export default ManageAccount;