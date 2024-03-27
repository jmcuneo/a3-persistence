const submit = async function(event) {
  event.preventDefault();

  const game = document.querySelector("#game").value,
      name = document.querySelector("#name").value,
      uid = document.querySelector("#uid").value,
      json = { game: game, name: name, uid: uid },
      body = JSON.stringify(json);

  // Make sure the endpoint here matches your Express route
  const response = await fetch("/submit", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json' // Ensure the server knows to expect JSON
    },
    body: body
  })
      .then(response => response.json())
      .then(function(data) {
        // Process response data...
        let form = document.getElementById("form");
        console.log(data);
        while (form.lastElementChild) {
          form.removeChild(form.lastElementChild);
        }

        for (let i = 0; i < data.length; i++) {
          var div = document.createElement('div');
          div.appendChild(document.createTextNode(`Game: ${data[i].game}, Nickname: ${data[i].name}, UID: ${data[i].uid}, Server: ${data[i].server}`));
          form.appendChild(div);
        }
      }).catch(error => console.error('Error:', error));
}

window.onload = function() {
  const button = document.querySelector("button");
  button.onclick = submit;
}