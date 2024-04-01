let loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let user = document.getElementById("username");
  let pass = document.getElementById("password");

  if (user.value == "" || pass.value == "") {
    alert("Enter your username and password");
  } else {
    const body = JSON.stringify({"username": user, "password": pass})
    fetch( "/login", {
        method:'POST',
        headers: { 'Content-Type': 'application/json'},
        body 
    }).then( response => response.json() )
    .then( json => console.log(json) )
  }
});