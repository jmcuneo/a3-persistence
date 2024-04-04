// FRONT-END (CLIENT) JAVASCRIPT HERE
import {redirect, submit} from './main.js'


/* let appdata = [

]
let averageData ={
  
} */
/* function generateTable(data, flag){
  let table = "";
  table = '<table>';
  if(!flag){
    table += '<tr><th>Make</th><th>Model</th><th>Year</th><th>MPG</th><th>Gs</th><th>accel</th></tr>';
    data.forEach(item => {
        table += `<tr><td>${item.make}</td><td>${item.model}</td><td>${item.year}</td><td>${item.mpg}</td><td>${item.lateralGs}</td><td>${item.accel}</td></tr>`;
    })
  } else{
    table += '<tr><th>Avg Make Len</th><th>Avg Model Len</th><th>Avg Year</th><th>Avg MPG</th><th>Avg Gs</th><th>Avg accel</th></tr>';
    table += `<tr><td>${data.avgMake}</td><td>${data.avgMake}</td><td>${data.avgYear}</td><td>${data.avgMpg}</td><td>${data.avgLateralGs}</td><td>${data.avgAccel}</td></tr>`
  }
  
  table += '</table>';
  return table;
} */
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