import {redirect, submit, errorHandler} from './main.js'
let data = false;
function generateTable(data){
  let table = "";
  table = '<table>';
  if(data){
    table += '<tr><th>name</th><th>Age</th><th>Coat</th><th>Solidity</th></tr>';
    data.forEach(item => {
        table += `<tr><td>${item.name}</td><td>${item.age}</td><td>${item.coat}</td><td>${item.solidity}</td></tr>`;
    })
  }
  
  table += '</table>';
  return table;
}
/* const parseData = {
  toFloat: function(data){
    let ret = {

    };
    for (const [key, value] of Object.entries(data)){
      ret[key] = isNaN(+value) ? value : +value;
    }
    return ret; 
  }
}
*/
async function checkAuth(event, endpoint){
  if(event) event.preventDefault();
  const rsp = await fetch(endpoint, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${document.cookie.substring(6)}`,
    }
  })
  if (rsp.status === 403){
    redirect(null, "login")
  }
  await rsp.json();
}

function makeTable(data){
  const tableContainer = document.getElementById('catData');
  tableContainer.innerHTML = "";
  tableContainer.innerHTML = generateTable(data);
}

window.onload = function() {
  /* getData(null) */
  /* const loginRedirectButton = document.querySelector("#login");
  loginRedirectButton.onclick = () => redirect(event, "/login");
  const registerButton = document.querySelector('#submit');
  registerButton.onclick = () => submit(event, "/register/new-user") */
  //checkAuth(null, "/auth/user-data").then(response => console.log("response: ",response))
  /* if(document.cookie){
    console.log("cookie exists")
  }else{
    redirect(null,"/login")
  } */
  submit(event, "/auth/user-data/fetch-cats", false)
                .then(result => makeTable(result))
                  .catch((error)=> errorHandler(error)); 
  if(localStorage.getItem("hasCodeRunBefore") === null){
    localStorage.setItem("hasCodeRunBefore", true);
  }
  //data.concat(submit(event, "/auth/user-data/fetch-cats", false));
  const submitButton = document.querySelector("#submit");
  submitButton.onclick = () => submit(event, "/auth/user-data/add-cat", "#catInfo")
                                .then(() => submit(event, "/auth/user-data/fetch-cats", false))
                                  .then(result => makeTable(result))
                                    .catch((error) => errorHandler(error));
  const logoutButton = document.querySelector("#logout");
  logoutButton.onclick = () => {
    document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
    redirect(null, '/login')
  }
  const deleteButton = document.querySelector("#delete")
  deleteButton.onclick = () => submit(event, "/auth/user-data/delete-cat", "#catInfo")
                                .then(() => submit(event, "/auth/user-data/fetch-cats", false))
                                  .then(result => makeTable(result))
                                    .catch((error) => errorHandler(error));
  /* const deleteButton = document.querySelector("#delete");
  deleteButton.onclick = () => submit(event, "/delete"); */
}