document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login-form");
  
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const username = document.querySelector("#username").value;
      const password = document.querySelector("#password").value;
  
      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
  
        if (response.ok) {
          window.location.replace("/page.html");
        } else {
          const errorMessage = await response.text();
          alert(errorMessage); 
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      }
    });
  });
  