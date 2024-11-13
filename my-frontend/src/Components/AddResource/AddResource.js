// CreateResource.js

import React, { useState } from 'react';
import './AddResource.css'; // Import the CSS file for styling

const CreateResource = () => {
    // State hooks for form data, error message, and success message
    const [title, setTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Form submit handler for creating a resource
    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        // Validate title field
        if (!title.trim()) {
            setErrorMessage('Resource title cannot be empty.');
            return;
        }

        const resourceData = { title };

        try {
            // Make POST request to the backend to create the resource
            const response = await fetch('http://localhost:8000/resource', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resourceData),
                credentials: 'include', // Include credentials (cookies) in the request
            });

            // If response is not OK, handle the error
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to create resource');
            }

            // Assuming response returns a success message
            const result = await response.json();
            setSuccessMessage('Resource created successfully!');

            // Optionally, redirect to the resource list page after a delay
            setTimeout(() => {
                window.location.href = '/all_resources'; // Redirect to the resource list page
            }, 2000);

        } catch (error) {
            setErrorMessage(error.message || 'There was an error creating the resource.');
        }
    };

    return (
        <div className="container">
            <h2>Create Resource</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title" className="label">Resource Title</label>
                    <input 
                        type="text" 
                        id="title" 
                        name="title" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} 
                        required
                        className="input"
                    />
                </div>
                <button type="submit" className="button">Create Resource</button>
            </form>

            {/* Error message */}
            {errorMessage && <div className="error">{errorMessage}</div>}

            {/* Success message */}
            {successMessage && <div className="success">{successMessage}</div>}
        </div>
    );
};

export default CreateResource;
