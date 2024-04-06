// FRONT-END (CLIENT) JAVASCRIPT HERE
import {redirect, submit} from './main.js'


/* let appdata = [

]
let averageData ={
  
} */
/* 
*/

/* const getData = async function(event){
  
  let response = await fetch("/get-app-data")
    .then(response => {
      if(!response.ok){
        throw new Error("network fucked");
      }
      return response.json();
    })
    .then(data => {
      appdata =data[0];
      averageData = data[1];
      const tableContainer = document.getElementById('data');
      tableContainer.innerHTML = "";
      tableContainer.innerHTML = generateTable(appdata);
      const avgTableContainer = document.getElementById('avgData');
      avgTableContainer.innerHTML = "";
      avgTableContainer.innerHTML = generateTable(averageData, 1);
      console.log('data', data);
    })
    .catch(error => {
      console.error(error);
    })

} */


window.onload = function() {
  /* getData(null) */
  const loginRedirectButton = document.querySelector("#login");
  loginRedirectButton.onclick = () => redirect(event, "/login");
  const registerButton = document.querySelector('#submit');
  registerButton.onclick = () => submit(event, "/register/new-user", "#register");
  /* registerButton.onclick = () => submit(event, "/register/new-user", "#register"); */
  /* const deleteButton = document.querySelector("#delete");
  deleteButton.onclick = () => submit(event, "/delete"); */
}