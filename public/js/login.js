var sessionToken = ""
const login = async function () {
    const usernameInput = document.getElementById("username-login")
    const passwordInput = document.getElementById("password-login")
    const json = {
        username: usernameInput.value,
        password: passwordInput.value,
    }

    console.log(json);
    const response = await fetch("/login",
        {
            method: "POST",
            body: JSON.stringify(json)
        })
        .then(response => {
            (response.json()
                .then(function (json) {
                    console.log("Session Token: " + json.uuid)
                    localStorage.setItem('sessionToken', json.uuid);
                    window.location.href = '/workout.html';
                }));
        })
}


const createAccount = async function () {
    const usernameInput = document.getElementById("username-create")
    const passwordInput = document.getElementById("password-create")
    const json = {
        username: usernameInput.value,
        password: passwordInput.value,
    }

    console.log(json);
    const response = await fetch("/create_account",
        {
            method: "POST",
            body: JSON.stringify(json)
        })
        .then(response => {
            (response.json()
                .then(function (json) {
                    console.log("Session Token: " + json.uuid)
                    localStorage.setItem('sessionToken', json.uuid);
                    window.location.href = '/workout.html';
                }));
        })
}

window.onload = function () {
    const backToLoginButton = document.getElementById("login-create-account-button");
    const createAccountButton = document.getElementById('create-account-button')
    const loginButton = document.getElementById("login-button");

    createAccountButton.addEventListener("click", () => {
        createAccount();
    })
    loginButton.addEventListener("click", () => {
        login();
    })

    backToLoginButton.addEventListener("click", () => {
        const loginPage = document.getElementById("login-page");
        const createAccountPage = document.getElementById("create-account-page");

        loginPage.style.display = "none";
        createAccountPage.style.display = "flex";
    });

    const backButton = document.getElementById("back-button");

    backButton.addEventListener("click", () => {
        const loginPage = document.getElementById("login-page");
        const createAccountPage = document.getElementById("create-account-page");

        createAccountPage.style.display = "none";
        loginPage.style.display = "flex";
    });
}