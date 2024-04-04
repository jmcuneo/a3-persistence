import {redirect} from './main.js'
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
  /* const deleteButton = document.querySelector("#delete");
  deleteButton.onclick = () => submit(event, "/delete"); */
}