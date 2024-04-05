document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#user").onkeydown = e => {
        if(e.key === "Enter") {
            e.preventDefault();
        }
    };
    document.querySelector("#pass").onkeydown = e => {
        if(e.key === "Enter") {
            e.preventDefault();
        }
    };

    document.querySelector("#attempt-login").onclick = e => submission(e, "login");
    document.querySelector("#attempt-create-account").onclick = e => submission(e, "create");
});

async function submission(e, type) {
    e.preventDefault();
    const username = document.querySelector("#user").value;
    const password = document.querySelector("#pass").value;
    if(type === "login") {
        const response = await fetch("/login", { method: "POST", body: JSON.stringify({ user: username, pass: password, newAccount: false }) })
        .then(r => r.text());

        if(response === "success") {
            document.cookie = `username=${encodeURIComponent(username)}; max-age=${60 * 60 * 24}`;
            document.cookie = `password=${encodeURIComponent(password)}; max-age=${60 * 60 * 24}`;
            window.open("/paint.html", "_self");
        } else {
            document.querySelector("#error-msg").textContent = "Your username or password is incorrect. Please try again.";
        }
    } else if(type === "create") {
        const response = await fetch("/login", { method: "POST", body: JSON.stringify({ user: username, pass: password, newAccount: true }) })
        .then(r => r.text());

        // Either success or already exists
        document.querySelector("#error-msg").textContent = response;
    }
};