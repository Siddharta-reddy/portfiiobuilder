document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('portfolio-form');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', async (event) => {
        // Prevent the default form submission which reloads the page
        event.preventDefault();

        // Gather all form data into an object
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            // Send the data as JSON to our Flask API endpoint
            const response = await fetch('/api/create-site', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // Display a success message with a link to the new site
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `
                ${result.message} <br>
                <a href="${result.url}" target="_blank">View Your New Site</a>
            `;
            form.reset(); // Clear the form fields
        } catch (error) {
            console.error('Error:', error);
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = 'An error occurred. Please try again.';
            resultDiv.style.backgroundColor = '#f8d7da'; // Make it red for error
        }
    });
});