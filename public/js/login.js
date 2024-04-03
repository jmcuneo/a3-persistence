const login = async function(event){
    event.preventDefault()

    const username = document.querySelector( "#username" ),
            password = document.querySelector( "#password" )

    const json = {
            "username": username.value,
            "password": password.value,

        },
        body = JSON.stringify(json);

    const response = await fetch( "/login", {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body
    })

    if(response.status === 201) {
        alert("New Account Created")
    }

    if(response.ok) {
        window.location.href = '/main';
    }

}


window.onload = function() {
    const loginbutton = document.querySelector("#loginbutton");
    loginbutton.onclick = login;

}

