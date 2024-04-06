import { redirect, submit } from "./main.js";

window.onload = function () {
  /* getData(null) */
  const registerButton = document.querySelector("#register");
  registerButton.onclick = () => redirect(event, "/register");
  const loginButton = document.querySelector("#login");
  loginButton.onclick = () => submit(event, "/login/auth", "#loginData").catch()
  /* const loginButton = document.querySelector(); */
  /* const deleteButton = document.querySelector("#delete");
    deleteButton.onclick = () => submit(event, "/delete"); */
};
