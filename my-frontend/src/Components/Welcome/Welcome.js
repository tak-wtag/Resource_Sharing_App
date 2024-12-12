import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import the correct hook
import './Welcome.css';  // Import the CSS file for styles

function WelcomePage() {
  const navigate = useNavigate(); // Using useNavigate for navigation

  // Event handlers for buttons
  const handleCreateAccount = () => {
    navigate('/sign-up'); // Navigate to the registration page
  };

  const handleLogin = () => {
    navigate('/login'); // Navigate to the login page
  };

  const handleContinue = () => {
    navigate('/all_resource'); // Navigate to the resources page
  };

  return (
    <div className="welcome-container">
      <h1>Welcome to Resource Sharing App!</h1>
      <p>Choose an option to continue</p>

      <div className="button-container">
        <button id="create-account-btn" onClick={handleCreateAccount}>
          Create Account
        </button>
        <button id="login-btn" onClick={handleLogin}>
          Login
        </button>
        <button id="continue-btn" onClick={handleContinue}>
          Continue Without Logging In
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;
