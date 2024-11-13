import React, { useEffect, useState } from 'react';
import './ResourceDetail.css'

const ResourceListPage = () => {
  const [resources, setResources] = useState([]); // State to store resources
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  // Function to fetch all resources from the backend
  const fetchResources = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/resource_details'); // Correct API URL
      const data = await response.json();

      if (data.msg) {
        setError(data.msg); // Handle error response from server
      } else {
        setResources(data); // Set resources data if successful
      }
    } catch (error) {
      setError('Error fetching resources'); // Catch any network errors
    } finally {
      setLoading(false); // Set loading to false after fetch is complete
    }
  };

  // Fetch resources when the component mounts
  useEffect(() => {
    fetchResources();
  }, []); // Empty dependency array means this runs once after initial render

  if (loading) {
    return <div>Loading...</div>; // Show loading message until data is fetched
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if fetching fails
  }

  return (
    <div className="container">
      <h1>Resource List</h1>
      <table id="resources-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>User ID</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {/* Render each resource in a row */}
          {resources.map((resource) => (
            <tr key={resource.id}>
              <td>{resource.id}</td>
              <td>{resource.resource_id}</td>
              <td>{resource.link}</td>
              <td>{new Date(resource.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResourceListPage;
