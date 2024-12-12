import React, { useEffect, useState } from 'react';
import './AllResource.css'; 
import { useNavigate } from 'react-router-dom'; 


function AllResourcesPage() {
  // State to store resources
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);  // To manage loading state
  const [error, setError] = useState(null);  // To handle errors

  // Fetch resources when the component mounts
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('/auth/resource/all');  // Update with the correct backend URL
        const data = await response.json();

        if (data.msg) {
          setError(data.msg);  // Handle empty or error responses from the server
        } else {
          setResources(data);  // Set the resources to state
        }
      } catch (error) {
        setError('Error fetching resources: ' + error.message);  // Handle any errors during fetch
      } finally {
        setLoading(false);  // Set loading to false when fetch is done
      }
    };

    fetchResources();
  }, []);  // Empty dependency array to run once on mount

  if (loading) {
    return <div>Loading...</div>;  // Show loading message while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>;  // Show error message if fetching fails
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
          {resources.map(resource => (
            <tr key={resource.id}>
              <td>{resource.id}</td>
              <td>{resource.title}</td>
              <td>{resource.user_id}</td>
              <td>{new Date(resource.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Want to see details?{' '}
        <a href='resource_detail'>GO</a>
      </p>
    </div>
  );
}

export default AllResourcesPage;
