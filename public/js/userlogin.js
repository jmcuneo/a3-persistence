
const login = async function( event ) {

    console.log("test login button pressed")

    /*
    const input = document.querySelector( "#userinput"),
        json = { username: input[0].value, password: input[1].value },
        body = JSON.stringify( json )


     */
    //alert("Invalid Username and/or Password")


    /*
    const getAccount = await fetch("/docs",
        {
            method: "GET",
            body: JSON.stringify(json)
        })      .then(response => response.json())
        .then(console.log)


     */
    console.log(getAccount.res)

}


window.onload = async function() {

    const button = document.getElementById("loginButton")
    button.onclick = login;

    console.log("test login page")

}