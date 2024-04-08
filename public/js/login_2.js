

let users = [
    { "user": "test_user", "password": "test_password" }
];

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    console.log(`Input:\t${username}\t${password}`)
    if (username === "")
        return

    // Find user object
    const userObject = users.find(user => user.user === username);

    if (userObject) {
        if (userObject.password === password) {
            // Password matches, redirect to index.html
            window.location.href = "index.html";
        } else {
            // Password does not match
            alert("Incorrect password. Please try again.");
        }
    } else {
        // Username not found, append new user object to users array
        users.push({ "user": username, "password": password });
        alert("New account created. Please log in again.");
        // In a real application, further action might be required for registration
    }

    console.log(users)
}



const get_data = async function fetchAppData( event ) {
    event.preventDefault()

    const response = await fetch('/data_base',{method:"GET"}); // Use the fetch API to get the data
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json(); // Parse the JSON data
    console.log("data\n", data)
    return data
}


window.onload = function() {
    // get_data;
    const button = document.querySelector("button");

    button.onclick = submit;
    // button.onclick = update_data;
}
