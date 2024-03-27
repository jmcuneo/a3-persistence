const switch_visible = function(event) {
    event.preventDefault();
    let login = document.querySelector("#login");
    let register = document.querySelector("#register");
    if (register.style.display === "none"){
        login.style.display = "none";
        register.style.display = "grid";
    }else {
        login.style.display = "grid";
        register.style.display = "none";
    }
}
const register = async function(event) {
    event.preventDefault();

    const username = document.querySelector("#username").value,
        password = document.querySelector("#password").value,
        json = { username: username, password: password },
        body = JSON.stringify(json);

    const response = await fetch("/register", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
        .then(response => response.text())
        .then(function(data) {
            console.log(data);
        }).catch(error => console.error('Error:', error));

}

const login = async function(event) {
    event.preventDefault();

    const username = document.querySelector("#username_login").value,
        password = document.querySelector("#password_login").value,
        json = { username: username, password: password },
        body = JSON.stringify(json);

    const response = await fetch("/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
        .then(response => response.text())
        .then(function(data) {
            console.log(data);
        }).catch(error => console.error('Error:', error));


}

window.onload = function() {
    document.getElementById("switch").addEventListener("click", switch_visible);
    document.getElementById("switch0").addEventListener("click", switch_visible);
    document.getElementById("register_btn").addEventListener("click", register);
    document.getElementById("login_btn").addEventListener("click", login);
}