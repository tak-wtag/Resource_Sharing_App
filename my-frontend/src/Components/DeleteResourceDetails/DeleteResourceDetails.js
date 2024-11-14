import React, { useState } from 'react';
import './DeleteResourceDetails.css'; // Import the CSS file for styling

const DeleteResourceDetails = () => {
    // State hooks for form data, error message, and success message
    const [id, setId] = useState('');  // The id passed in the URL for the resource details
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Form submit handler for updating a resource
    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        // Validate fields
        if (!id.trim()) {
            setErrorMessage('Resource ID cannot be empty.');
            return;
        }
        try {
            // Make PUT request to the backend to update the resource
            const response = await fetch(`http://localhost:8000/delete_resource_details/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
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
            <h2>Delete Resource Details</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="id" className="label">ID</label>
                    <input 
                        type="number" 
                        id="id" 
                        name="id" 
                        value={id}
                        onChange={(e) => setId(e.target.value)} 
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

export default DeleteResourceDetails;
