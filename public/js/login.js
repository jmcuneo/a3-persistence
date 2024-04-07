import { errorHandler, redirect, submit } from "./main.js";

window.onload = function () {
  /* getData(null) */
  const registerButton = document.querySelector("#register");
  registerButton.onclick = () => redirect(event, "/register").catch(error => errorHandler(error));
  const loginButton = document.querySelector("#login");
  console.log()
  loginButton.onclick = () => submit(event, "/login/auth", "#loginData").catch(error => errorHandler(error))
  /* const loginButton = document.querySelector(); */
  /* const deleteButton = document.querySelector("#delete");
    deleteButton.onclick = () => submit(event, "/delete"); */
};
