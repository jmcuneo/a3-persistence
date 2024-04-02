const loginForm = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');
const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
});

loginButton.addEventListener('click', async () => { 
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        messageDiv.textContent = 'Logging in...'; // Show 'logging in' message
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) { // Check for error status codes
            const data = await response.json(); 
            messageDiv.textContent = data.message; // Display the specific error message
            throw new Error('Login failed'); // Create an error for clarity
        } 

        // If successful
        const data = await response.json();
        messageDiv.textContent = "Logging In ...";
        window.location.href = "main.html";  

    } catch (error) {
        console.error('Login error:', error);
    }
});

registerButton.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/register', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            // Registration successful
            messageDiv.textContent = 'Registration successful! You can now log in.'; 
        } else {
            messageDiv.textContent = 'Registration failed. Please try again.';
        }
    } catch (error) {
        console.error('Registration error:', error);
        messageDiv.textContent = 'An error occurred during registration';
    }
});

