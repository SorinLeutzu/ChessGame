import './Login.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate();
 

  const handleSubmit = async (e) => {
    e.preventDefault();
       invoke('user_exists', { username, password }).then((result) => {
        if (result.exists==true) navigate("/main_menu");
          else console.log("Invalid credentials");
      })
      .catch((error) => {
        console.error('Error invoking Tauri command:', error);
      });
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;