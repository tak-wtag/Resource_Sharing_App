import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ResourceManagement.css'

const ResourceManagementPage = () => {
  const navigate = useNavigate(); // React Router's navigate function for redirecting
  return (
    <div className="container">
      <h2>Resource Management</h2>
      <button className="button" onClick={() => navigate('/all_resource')}>Get Resource</button>
      <button className="button" onClick={() => navigate('/add_resource')}>Add Resource</button>
      <button className="button" onClick={() => navigate('/add_resource_details')}>Add Resource Details</button>
      <button className="button" onClick={() => navigate('/update_resource')}>Update Resource</button>
      <button className="button" onClick={() => navigate('/update_resource_details')}>Update Resource Details</button>
      <button className="button" onClick={() => navigate('/delete_resource')}>Delete Resource</button>
      <button className="button" onClick={() => navigate('/delete_resource_details')}>Delete Resource Details</button>
      <button className="button logout-btn" onClick={() => navigate('/logout')}>Logout</button>
    </div>
  );
};

export default ResourceManagementPage;
