import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // To redirect after logout
import './Logout.css'; // Assuming you have a separate CSS file for styling

const Logout = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // To redirect to login or home after logging out

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const response = await fetch('http://localhost:8000/auth/logout', {
          method: 'POST',
          credentials: 'include', // Ensure cookies are included in the request
        });

        if (response.ok) {
          setMessage('You have logged out successfully.');
          setTimeout(() => {
            navigate('/login'); // Redirect to the login page after a successful logout
          }, 1500);
        } else {
          const errorData = await response.json();
          setMessage(errorData.detail || 'An error occurred during logout.');
        }
      } catch (error) {
        setMessage('Error: Unable to reach the server.');
      }
    };

    // Trigger logout as soon as the component is mounted
    handleLogout();
  }, [navigate]);

  return (
    <div className="logout-container">
      <h2>Logging out...</h2>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default Logout;
