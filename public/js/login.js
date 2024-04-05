const login = function(event){

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
  
    fetch('/login', {
      method: 'POST',
      body: JSON.stringify({username: username, password: password})
    }).then(response => {
        if (response.ok) {
            // Redirect to homepage
            response.json().then(data => {
              // Store the username from the response
              localStorage.setItem('userName', username);
              console.log(username);
              window.location.href = "/html/home.html";
  
          });
      } else {
        response.json().then(function(json){
          // bad pass/user
          alert('Invalid: ' + json.message);
        }
        )
      }
  })
  .catch(error => console.error('Error:', error));
  
  return false; // Prevent default form submission
  }

const createAccount = function(event){
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
  
    fetch('/createAccount', {
      method: 'POST',
      body: JSON.stringify({username: username, password: password})
    }).then(response => {
      if (response.ok) {
          // Redirect to homepage
          response.json().then(data => {
            // Store the username from the response
            localStor200age.setItem('userName', username);
            console.log(username);
            window.location.href = "/html/home.html";

        });
      } else {
        response.json().then(function(json){
          // bad pass/user
          alert('Invalid: ' + json.message);
        })
          
      }
  })
  .catch(error => console.error('Error:', error));
  
  return false; // Prevent default form submission
}

  window.onload = function(){
    //window.location.href = '/login.html';
  }