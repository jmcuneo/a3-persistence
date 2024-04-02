const submitLogin = async function(event) {
    event.preventDefault();

    const inputName = document.querySelector("#name")
    const inputPassword = document.querySelector("#password")

    const name = inputName.value.trim()
    const password = inputPassword.value.trim()

    if (name === "" || password === "") {
        alert("Please enter a valid username and password.")
        return;
    }

    const json = { name: inputName.value, password: inputPassword.value }
    const body = JSON.stringify(json)

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
        });

        if (response.ok) {
            window.location.href = "/app.html"
        } else {
            const responseData = await response.json()

            const loginMessage = document.querySelector("#login-message")
            loginMessage.textContent = responseData.message

            inputName.value = ""
            inputPassword.value = ""
        }
    } catch (error) {
        console.error("Error:", error)
    }
};

window.onload = function() {
    const loginButton = document.querySelector("#login-button");
    if (loginButton){
        loginButton.onclick = submitLogin;
    }

};