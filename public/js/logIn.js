// FRONT-END (CLIENT) JAVASCRIPT HERE

//This function is called when data is being entered into the table through the text boxes
const submit = async function(event) {

    //this assigns the input values into variables
    const input =
        username = document.querySelector("#usernameInput").value;
        password = document.querySelector("#passwordInput").value;

    //this creates the json
    json = { username: username, password: password},
        body = JSON.stringify(json)

    const response = await fetch("/signin", {
        method: "POST",
        body: body,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json()
    console.log(data)
    
    if (data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/index.html';
    } else {
        // Handle error
        console.error(data.message);
    }
}


window.onload = async function() {

    const signInButton = document.querySelector("#signInButton");
    signInButton.onclick = submit;
}