const submitRegister = async function(event) {
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

    const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
    }).then(function(response){
        return response.json()
    }).then(function(json){
        console.log(json)

        const registerMessage = document.querySelector("#register-message")
        registerMessage.textContent = json.message

        inputName.value = ""
        inputPassword.value = ""
    })


};

window.onload = function() {
    const registerButton = document.querySelector("#register-button")
    if (registerButton){
        registerButton.onclick = submitRegister;
    }

};