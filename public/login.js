// login.js for login page

// handle the login mechanism
document.getElementById('login').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    alert(data.message);
    if (data.loggedIn) {
        window.location.href = '/app'; // redirect to the app page
    }
});