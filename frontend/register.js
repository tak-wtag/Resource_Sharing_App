document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting normally

    // Get the values from the form fields
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Prepare the data to send to the backend
    const userData = {
        name: name,
        email: email,
        password: password
    };

    // Make a POST request to the backend to create a new user
    fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.msg === 'user created successfully') {
            // Redirect to login page after successful registration
            window.location.href = 'login.html';
        } else {
            alert('Error: ' + data.detail || 'Failed to create user');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Something went wrong. Please try again later.');
    });
});
