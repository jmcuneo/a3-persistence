import {redirect, submit} from './main.js'
let data =[];
function generateTable(){
  let table = "";
  table = '<table>';
  if(this.data.length){
    table += '<tr><th>name</th><th>Age</th><th>Coat</th><th>Solidity</th></tr>';
    this.data.forEach(item => {
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
  const text = await rsp.json();
  console.log(text)
}

function makeTable(){
  const tableContainer = document.getElementById('catData');
  tableContainer.innerHTML = "";
  tableContainer.innerHTML = generateTable();
}

window.onload = function() {
  /* getData(null) */
  /* const loginRedirectButton = document.querySelector("#login");
  loginRedirectButton.onclick = () => redirect(event, "/login");
  const registerButton = document.querySelector('#submit');
  registerButton.onclick = () => submit(event, "/register/new-user") */
  if(document.cookie){
    console.log("cookie exists")
  }else{
    redirect(null,"/login")
  }
  checkAuth(null, "/auth/user-data")
  submit(event, "/auth/user-data/fetch-cats", false).then(result => console.log(result))
  data.concat(submit(event, "/auth/user-data/fetch-cats", false));
  const submitButton = document.querySelector("#submit");
  submitButton.onclick = () => submit(event, "/auth/user-data/add-cat", "#catInfo").then(()=>this.data.concat(submit(event, "/auth/user-data/fetch-cats", false))).finally(() => makeTable());
  /* const deleteButton = document.querySelector("#delete");
  deleteButton.onclick = () => submit(event, "/delete"); */
}