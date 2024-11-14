// CreateResourceDetails.js

import React, { useState } from 'react';
import './AddResourceDetails.css'; // Import the CSS file for styling

const CreateResourceDetails = () => {
    // State hooks for form data, error message, and success message
    const [resourceId, setResourceId] = useState('');
    const [link, setLink] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Form submit handler for creating resource details
    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        // Validate resourceId and link fields
        if (!resourceId.trim() || !link.trim()) {
            setErrorMessage('Both Resource ID and Link are required.');
            return;
        }

        const resourceDetails = {
            resource_id: parseInt(resourceId),
            link,
        };

        try {
            // Make POST request to the backend to create the resource details
            const response = await fetch('http://localhost:8000/resource_details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resourceDetails),
                credentials: 'include', // Include cookies (token) in the request
            });

            // If response is not OK, handle the error
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to create resource details');
            }

            // Assuming response returns a success message
            const result = await response.json();
            setSuccessMessage(result.msg || 'Resource details created successfully!');

            // Optionally, redirect to the resource list page after a delay
            setTimeout(() => {
                window.location.href = '/resource_management'; // Redirect to the resource list page
            }, 2000);

        } catch (error) {
            setErrorMessage(error.message || 'There was an error creating the resource details.');
        }
    };

    return (
        <div className="container">
            <h2>Create Resource Details</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="resourceId" className="label">Resource ID</label>
                    <input 
                        type="number" 
                        id="resourceId" 
                        name="resourceId" 
                        value={resourceId}
                        onChange={(e) => setResourceId(e.target.value)} 
                        required
                        className="input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="link" className="label">Link</label>
                    <input 
                        type="url" 
                        id="link" 
                        name="link" 
                        value={link}
                        onChange={(e) => setLink(e.target.value)} 
                        required
                        className="input"
                    />
                </div>
                <button type="submit" className="button">Create Resource Details</button>
            </form>

            {/* Error message */}
            {errorMessage && <div className="error">{errorMessage}</div>}

            {/* Success message */}
            {successMessage && <div className="success">{successMessage}</div>}
        </div>
    );
};

export default CreateResourceDetails;
