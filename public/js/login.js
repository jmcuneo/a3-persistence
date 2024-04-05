const login = async function(event) {
    event.preventDefault()
    const userdata = {
        uname: document.getElementById("uname").value,
        psw: document.getElementById("psw").value,
    }

    const body = JSON.stringify(userdata)

    const response = await fetch("/login", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body
      })

    if (response.status == 401){
        let err_msg = document.createElement("div")
        let close_msg = document.createElement("delete")
        err_msg.className = "notification is-danger"
        close_msg.className = "delete"
        err_msg.appendChild(close_msg)
        err_msg.appendChild(document.createTextNode("Incorrect Username or Password!"))
        document.body.appendChild(err_msg)
    } else if(response.status == 200){
        location.href = "/main"
    }
}






window.onload = function () {
    const button_login = document.getElementById("login");
    
    button_login.onclick = login
    
    
  
  
  }