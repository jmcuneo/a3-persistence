const submit = async function(event) {
  event.preventDefault();

  const
      game = document.querySelector("#game").value,
      name = document.querySelector("#name").value,
      uid = document.querySelector("#uid").value,
      owner = document.querySelector("#uid").value,
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

const modify = async function(event) {
    event.preventDefault();

    const game = document.querySelector("#game").value,
        name = document.querySelector("#name").value,
        uid = document.querySelector("#uid").value,
        json = { game: game, name: name, uid: uid },
        body = JSON.stringify(json);

    const response = await fetch("/modify", {
        method: "POST",
        headers: {
        'Content-Type': 'application/json'
        },
        body: body
    })
        .then(response => response.text())
        .then(function(data) {
            console.log(data);
        }).catch(error => console.error('Error:', error));
}

const delete_data = async function(event) {
event.preventDefault();

    const game = document.querySelector("#game").value,
        name = document.querySelector("#name").value,
        uid = document.querySelector("#uid").value,
        json = { game: game, name: name, uid: uid },
        body = JSON.stringify(json);

    const response = await fetch("/delete", {
        method: "POST",
        headers: {
        'Content-Type': 'application/json'
        },
        body: body
    })
        .then(response => response.text())
        .then(function(data) {
            console.log(data);
        }).catch(error => console.error('Error:', error));
}

window.onload = function() {
  const button = document.querySelector("button");
  button.onclick = submit;
}

document.addEventListener('DOMContentLoaded', () => {
    // Assuming all containers are inside a parent with the ID 'parentContainer'
    const parentContainer = document.getElementById('parentContainer');

    parentContainer.addEventListener('click', function(event) {
        if (event.target.className === 'editBtn') {
            // The event's target is the button, navigate to the container
            const container = event.target.parentElement;

            const field1 = container.querySelector('.field1').value;
            const field2 = container.querySelector('.field2').value;
            const field3 = container.querySelector('.field3').value;
            const field4 = container.querySelector('.field4').value;
            const field5 = container.querySelector('.field5').value;

            // Example action: Toggle the 'readonly' property
            field1.readOnly = !field1.readOnly;
            field2.readOnly = !field2.readOnly;

            // Optionally, focus the first field for immediate editing
            if (!field1.readOnly) {
                field1.focus();
            }
        }
    });
});