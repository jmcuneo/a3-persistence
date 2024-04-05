document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.querySelector('form');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data.message);
                if (data.message === 'User created successfully') {
                    alert('User created successfully');
                }
             window.location.href = '/index.html';
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });
});