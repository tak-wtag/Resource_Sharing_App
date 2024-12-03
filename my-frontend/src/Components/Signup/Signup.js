import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Used for redirecting to login page
import './Signup.css'; // Assuming you have a separate CSS file for styling

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validation
    if (!name || !email || !password) {
      setErrorMessage('All fields are required.');
      return;
    }

    const userData = { name, email, password };

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Successful registration, show message and redirect
        setSuccessMessage('Registration successful!');
        setTimeout(() => {
          navigate('/login'); // Redirect to the login page after successful registration
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
    <div className="signup-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="User Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default SignUp;
