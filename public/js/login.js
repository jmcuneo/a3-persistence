import {redirect} from './main.js'

window.onload = function() {
    /* getData(null) */
    const registerButton = document.querySelector("#register");
    registerButton.onclick = () => redirect(event, "/register");
    /* const deleteButton = document.querySelector("#delete");
    deleteButton.onclick = () => submit(event, "/delete"); */
  }