
const login = async function( event ) {

    event.preventDefault()

    console.log("test login button pressed")



    const input = document.querySelector( "#userinput"),
        json = { username: input[0].value, password: input[1].value },
        body = JSON.stringify( json )



    //alert("Invalid Username and/or Password")



    const getAccount = await fetch("/docs",
        {
            method:"GET"
        })
        .then(response => response.json())
        .then(console.log)




}


window.onload = async function() {

    const loginButton = document.getElementById("loginButton")
    loginButton.onclick = login;

    console.log("test login page")

}