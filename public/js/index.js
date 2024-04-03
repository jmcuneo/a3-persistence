const submit = async function( event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()
    
    const uname = document.querySelector( "#username" ),
          pass = document.querySelector( "#password" ),
          json = { username: uname.value, password: pass.value},
          body = JSON.stringify( json )
  
    const response = await fetch( "/login", {
      method:"POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body 
    })

    const data = await response.json();
    console.log(data.msg);
    if(data.login) {
      window.location.href = '/main';
    }
  }

window.onload = function () {
    const submitBtn = document.querySelector("#submit");
    submitBtn.onclick = submit;
}