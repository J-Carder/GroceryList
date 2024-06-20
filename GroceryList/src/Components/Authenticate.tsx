import React, { useState } from 'react';
import "../css/Auth.css";

const Authenticate = () => {
  const [isLogin, setIsLogin] = useState(false)

  return (
    <div>
      <h1>Welcome to the Grocery List App</h1>
      <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Create an account?" : "Log in to existing account"}</button>

      {isLogin ? 
      <>
        <input type="text" placeholder="username or email" />
        <input type="text" placeholder="password" />
        <button>Login</button>
      </>
      :
      <>
        <input type="text" placeholder="username" />
        <input type="email" placeholder="email" />
        <input type="text" placeholder="password" />
        <input type="text" placeholder="password again" />
        <button>Register</button>
      </>
      }
    </div>
  )
}

export default Authenticate