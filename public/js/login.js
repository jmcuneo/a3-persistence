const log = async function (event) {
    event.preventDefault()

    const username = document.querySelector("#username"),
        password = document.querySelector("#password")

    const json = {
        "username": username.value,
        "password": password.value,

    },
        body = JSON.stringify(json);

    const response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body
    })

    if (response.status === 201) {
        alert("New Account Created")
    }

    if (response.ok) {
        window.location.href = '/backend.html';
    }

}

const gitLogin = function (event) {
    event.preventDefault();

    // Directly redirect the browser to the GitHub OAuth login page
    window.location.href = "/github/login";
};

window.onload = function () {
    const gitLoginButton = document.querySelector(".githubLogin");
    const loginbutton = document.querySelector("#loginbutton");
    gitLoginButton.addEventListener('click', gitLogin);
    loginbutton.addEventListener('click', log)

};