const login = async function(event){
    event.preventDefault()

    const username = document.getElementById("username"),
        password = document.getElementById("pass"),
        json = {"username": username.value, "password": password.value},
        body = JSON.stringify(json)
    const response = await fetch( "/login", {
        method:"POST",
        body,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => response.json()
    ).then((json) =>data =json)

    if(data.success){
        window.location.href = "/main.html"
    } else{
        alert("Invalid username or password")
    }

    //console.log( "text:", text )
}



window.onload = function () {
    const loginButton = document.getElementById("login");
    loginButton.onclick = login;
}