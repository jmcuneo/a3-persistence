document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value,
      password = document.getElementById("password").value,
      json = { username: username, password: password },
      body = JSON.stringify(json);

    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body
    });
    const data = await response.json();

    if (data.loggedIn) {
      window.location.href = "/app.html";
    }
  });
