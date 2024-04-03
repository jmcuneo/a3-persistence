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
        email = document.querySelector("#email").value,
        password = document.querySelector("#password").value,
        json = { email: email, username: username, password: password, role: "regular" },
        body = JSON.stringify(json);

    const response = await fetch("/register", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
        .then(function (res) {
            if (res.status === 201){
                window.alert('register successful')
                switch_visible();
            }
            else{
                window.alert('User already exist')
            }
        } )
        .catch(error => console.error('Error:', error));

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
    }).then(function (res){
        window.location.href = res.url;
    })
}

window.onload = function() {
    document.getElementById("switch").addEventListener("click", switch_visible);
    document.getElementById("switch0").addEventListener("click", switch_visible);
    document.getElementById("register_btn").addEventListener("click", register);
    document.getElementById("login_btn").addEventListener("click", login);
}