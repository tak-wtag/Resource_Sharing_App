import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Assuming you have a separate CSS file for styling

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validation
    if (!username || !password) {
      setErrorMessage('Both username and password are required.');
      return;
    }

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: username,
          password: password,
        }).toString(),
        credentials: 'include', // This ensures cookies are sent and received
      });

      if (response.ok) {
        // Successful login, show message and redirect
        setSuccessMessage('Login successful!');
        setTimeout(() => {
          navigate('/resource_management'); // Redirect to a protected page after successful login
        }, 1500);
      } else {
        // Handle failure response from backend
        const errorData = await response.json();
        setErrorMessage(errorData.detail || 'An error occurred, please try again.');
      }
    } catch (error) {
      setErrorMessage('Error: Unable to reach the server.');
    }
  };

  return (
    <div className="login-user-container">
      <h2>Login Here</h2>
      <form onSubmit={handleSubmit} className="login-user-form">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <p>
        Don't have an account? <a href="/sign-up">Sign up here</a>
      </p>
    </div>
  );
};

export default Login;
