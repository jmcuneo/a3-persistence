

const login = async (username, password) => {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        console.log("Input\n", JSON.stringify({ username, password }))
        const data = await response.json();

        if (!response.ok) {
            console.log(response)
            // alert("Login failed")
            alert(`Login Warning: ${data.message}`)
            throw new Error('Login request failed');
        }

        console.log('Login successful:', data);
        window.location.href = "index.html";
        // Handle successful login, such as redirecting to another page or updating UI
    } catch (error) {
        console.error('Error during login:', error);
        // Handle error, such as showing a login error message
    }
};




window.onload = function() {
    // // get_data;
    const button = document.getElementById("login_button");
    // let input_username = document.getElementById("username").value
    // let input_password = document.getElementById("password").value
    // console.log(input_password, input_password)
    button.onclick = (event) => {
        event.preventDefault()
        let input_username = document.getElementById("username").value
        let input_password = document.getElementById("password").value
        login(input_username, input_password)
    }
    // button.onclick = submit


    // // // button.onclick = update_data;
    // login('user123', 'password123');

}