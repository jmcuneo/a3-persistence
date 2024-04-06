// FRONT-END (CLIENT) JAVASCRIPT HERE


const logIn = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const username = document.getElementById("username").value,
        password = document.getElementById("password").value
        json = {username: username,
                password: password
               },
        body = JSON.stringify(json)

  await fetch( "/login", {
    method:"POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body 
  })
  .then(response => response.text()).then(text => {
    console.log(text)
    if(text === "correct")
    {
      window.location.href = "home.html"
    }
    else if (text == "new account")
    {
      alert("This account does not exist, so a new account was created with these credentials")
      window.location.href = "home.html"
    }
    else if (text == "incorrect")
    {
      alert("Incorrect Password")
    }
    else
    {
      alert(text)
    }
  })
}

window.onload = function () {
  const logInButton = document.getElementById("logInButton")
  logInButton.onclick = logIn
}