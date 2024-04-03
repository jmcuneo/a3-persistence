const login = function (event) {
  event.preventDefault();

  console.log("LOG IN!");
  // Directly redirect the browser to the GitHub OAuth login page
  window.location.href = "/github/login";
};

window.onload = function () {
  const loginButton = document.querySelector(".loginButton");
  loginButton.addEventListener('click', login);
};
