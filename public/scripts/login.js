const pingUser = async (e) => {
    console.log(e);
    const user_field = document.getElementById("user");
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

const login = async () => {
    const user_field = document.getElementById("user");
    const pass_field = document.getElementById("pwd");
    let body = JSON.stringify({user: user_field.value, pass: pass_field.value})
    const login = await fetch("/login", {method: "POST", body:body});
    let resp = await login.text();
    if(resp != "1") {
        const login_btn = document.getElementById("submit")
        login_btn.style.backgroundColor = "#ad0101";
    } else {
        window.location.href = '/html/boxes.html?user=' + user_field.value;
    }
}