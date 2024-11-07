// Function to fetch all resources from the backend and update the table
async function fetchResources() {
    try {
        const response = await fetch('http://localhost:8000/auth/resource/all');  // Update with the correct backend URL
        const resources = await response.json();

        if (resources.msg) {
            console.error(resources.msg); // Handle empty or error responses from the server
        } else {
            const tableBody = document.getElementById('resources-table').getElementsByTagName('tbody')[0];
            resources.forEach(resource => {
                const row = tableBody.insertRow();

                const cellId = row.insertCell(0);
                const cellTitle = row.insertCell(1);
                const cellUserId = row.insertCell(2);
                const cellCreatedAt = row.insertCell(3);

                cellId.textContent = resource.id;
                cellTitle.textContent = resource.title;
                cellUserId.textContent = resource.user_id;
                cellCreatedAt.textContent = new Date(resource.created_at).toLocaleString();  // Format created_at
            });
        }
    } catch (error) {
        console.error('Error fetching resources:', error);
    }
}

// Fetch the resources on page load
window.onload = fetchResources;

