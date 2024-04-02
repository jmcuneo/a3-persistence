window.onload = async function() {
  // let loginForm = await document.getElementById("loginForm");
  // loginForm.addEventListener("submit", login)

  // let loginButton = await document.getElementById("githubLogin");
  // loginButton.addEventListener("click", event => {
  //   event.preventDefault()
  //   fetch( '/login', {
  //       method:'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Access-Control-Allow-Origin': '*'
  //       }
  //   }).then((response) => {
  //     response.json()
  //   }).then(resp => {
  //     console.log(resp)
  //   })
  // })
}

function login( event ) {
  event.preventDefault();

  let user = document.getElementById("username");
  let pass = document.getElementById("password");

  if (user.value == "" || pass.value == "") {
    alert("Enter your username and password");
  } else {
    const body = JSON.stringify({"username": user, "password": pass})
    fetch( '/auth/github', {
        method:'GET',
        headers: { 'Content-Type': 'application/json'}
    }).then( response => response.json() )
    .then( json => console.log(json) )
  }
}