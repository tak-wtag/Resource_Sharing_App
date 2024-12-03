// UpdateResource.js

import React, { useState } from 'react';
import './UpdateResource.css'; // Import the CSS file for styling

const UpdateResource = () => {
    // State hooks for form data, error message, and success message
    const [title, setTitle] = useState('');
    const [Id, setId] = useState('');  // New state for the `id`
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Form submit handler for updating a resource
    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        // Validate fields
        if (!title.trim()) {
            setErrorMessage('Resource title cannot be empty.');
            return;
        }

        if (!Id.trim()) {
            setErrorMessage('Resource ID cannot be empty.');
            return;
        }

        const resourceData = { title };  // Only include title in the payload

        try {
            // Make PUT request to the backend to update the resource
            const response = await fetch(`/update_resource/${Id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resourceData),
                credentials: 'include', // Include credentials (cookies) in the request
            });

            // If response is not OK, handle the error
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to update resource');
            }

            // Assuming response returns a success message
            const result = await response.json();
            setSuccessMessage('Resource updated successfully!');

            // Optionally, redirect to the resource list page after a delay
            setTimeout(() => {
                window.location.href = '/resource_management'; // Redirect to the resource list page
            }, 2000);

        } catch (error) {
            setErrorMessage(error.message || 'There was an error updating the resource.');
        }
    };

    return (
        <div className="container">
            <h2>Update Resource</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="id" className="label">Resource ID</label>
                    <input 
                        type="number" 
                        id="id" 
                        name="id" 
                        value={Id}
                        onChange={(e) => setId(e.target.value)} 
                        required
                        className="input"
                    />
                </div>

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

                <button type="submit" className="button">Update Resource</button>
            </form>

            {/* Error message */}
            {errorMessage && <div className="error">{errorMessage}</div>}

            {/* Success message */}
            {successMessage && <div className="success">{successMessage}</div>}
        </div>
    );
};

export default UpdateResource;
