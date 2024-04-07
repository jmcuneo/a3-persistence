// FRONT-END (CLIENT) JAVASCRIPT HERE
import {redirect, submit, errorHandler} from './main.js'


window.onload = function() {
  /* getData(null) */
  const loginRedirectButton = document.querySelector("#login");
  loginRedirectButton.onclick = () => redirect(event, "/login").catch(error => errorHandler(error));
  const registerButton = document.querySelector('#submit');
  registerButton.onclick = () => submit(event, "/register/new-user", "#register").catch(error => errorHandler(error));
  /* registerButton.onclick = () => submit(event, "/register/new-user", "#register"); */
  /* const deleteButton = document.querySelector("#delete");
  deleteButton.onclick = () => submit(event, "/delete"); */
}