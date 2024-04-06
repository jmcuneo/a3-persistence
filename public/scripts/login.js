const pingUser = async (e) => {
    const user_field = document.getElementById("user");
    const pass_field = document.getElementById("pwd");
    user_field.style.border = "none";
    pass_field.style.border = "none";
    const error = document.getElementById("error")
    error.style.display = "hidden";
    let user = user_field.value
    const exists = await fetch("/user_exists?" + new URLSearchParams({user: user}), {method: "GET"});
    const out = await exists.text();
    const login_btn = document.getElementById("submit")
    if (out === "1") {
        login_btn.style.backgroundColor = "#0172ad";
        login_btn.value = "Login";
    } else {
        login_btn.style.backgroundColor = "#01ad57";
        login_btn.value = "Create Account";
    }
}

let noempty = /.+/;
const login = async () => {
    const user_field = document.getElementById("user");
    const pass_field = document.getElementById("pwd");
    const error = document.getElementById("error")
    let body = JSON.stringify({user: user_field.value, pass: pass_field.value})
    const login = await fetch("/try_login", {method: "POST", body:body});
    let resp = await login.text();
    if(resp != "1") {
        const login_btn = document.getElementById("submit")
        login_btn.style.backgroundColor = "#ad0101";
        error.style.display = "block";
        if(noempty.test(user_field.value) == false) {
            error.innerHTML = "Username field must not be empty."
            user_field.style.border = "4px solid crimson";
        } else if(noempty.test(pass_field.value) == false) {
            error.innerHTML = "Password field must not be empty."
            pass_field.style.border = "4px solid crimson";
        } else {
            error.innerHTML = "Incorrect password for " + user_field.value + ".";
        }
    } else {
        window.location.href = `/login?user=${user_field.value}&pass=${pass_field.value}`;
    }
}