const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
let user = "";
let current_edit;
const submit = async function(event) {
  event.preventDefault();

  const
      game = document.querySelector("#game").value,
      name = document.querySelector("#name").value,
      uid = document.querySelector("#uid").value;
    let server = "Other";

    switch (uid.charAt(0)) {
        case '1':
            server = "CN";
            break;
        case '9':
            server = "Test Server";
            break;
        case '6':
            server = "US";
            break;
        case '7':
            server = "EU";
            break;
        default:
            server = "Other";
            break;
    }
      const json = { game: game, name: name, uid: uid, server: server, owner: user},
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
          window.location.reload();
      }).catch(error => console.error('Error:', error));
}


const get_user = async function () {
    const response = await fetch("/verify", {
        method: "get",
    })
        .then(response => response.json())
        .then(function (data) {
                user = data.username;
                document.querySelector("#userinfo").textContent = `Username: ${data.username}   Email: ${data.email}`

        }).catch(error =>  window.location.href = '../index.html');

        load_item();
}


window.onload = function() {
    get_user();
    const button = document.querySelector("button");
    button.onclick = submit;
    // load_item();
}

const load_item = async function () {
    const parentContainer = document.getElementById('form');

    let j = {username: user}
    const response1 = await fetch("/data", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(j)
    })
        .then(response => response.json())
        .then(function (data) {
            console.log(data)
            for (const key in data) {

                let box = document.createElement("div");
                box.className = "output"
                let text = document.createElement("span");
                text.innerHTML = `<span>Game: ${data[key].game}</span><br>`;
                text.innerHTML += `<span>Name: ${data[key].name}</span><br>`;
                text.innerHTML += `<span>UID: ${data[key].uid}</span><br>`;
                text.innerHTML += `<span>Server: ${data[key].server}</span><br>`;

                box.appendChild(text);
                let mod_btn = document.createElement("button");
                mod_btn.ref = data[key].uid;
                mod_btn.textContent = "Modify";
                mod_btn.onclick = function (){
                    text.innerHTML = `<span>Game: <textarea id="game">${data[key].game}</textarea></span><br>`;
                    text.innerHTML += `<span>Name: <textarea id="name">${data[key].name}</textarea></span><br>`;
                    text.innerHTML += `<span>UID: <textarea id="uid" disabled>${data[key].uid}</textarea></span><br>`;
                    text.innerHTML += `<span>Server: <textarea id="game" disabled>${data[key].server}</textarea></span><br>`;

                    mod_btn.textContent = "Update"
                    mod_btn.onclick = async function () {
                        const game = mod_btn.parentElement.querySelector("#game").value,
                            name = mod_btn.parentElement.querySelector("#name").value,
                            uid = mod_btn.parentElement.querySelector("#uid").value

                        let server = "Other";

                        switch (uid.charAt(0)) {
                            case '1':
                                server = "CN";
                                break;
                            case '9':
                                server = "Test Server";
                                break;
                            case '6':
                                server = "US";
                                break;
                            case '7':
                                server = "EU";
                                break;
                            default:
                                server = "Other";
                                break;
                        }
                            const json = {game: game, name: name, uid: uid, server: server, owner: data[key].owner},
                            body = JSON.stringify(json);

                        console.log(json)

                        const response = await fetch("/modify", {
                            method: "PUT",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: body
                        })
                            .then(response => response.text())
                            .then(function (data) {
                                window.alert("Data modify successful");
                                window.location.reload();
                            }).catch(error => console.error('Error:', error));
                    }
                };
                box.appendChild(mod_btn);
                let del_btn = document.createElement("button");
                del_btn.ref = data[key].uid;
                del_btn.textContent = "Delete";
                del_btn.onclick = function (){
                    del_btn.textContent = "Confirm"
                    del_btn.onclick = () => {
                        delete_field(del_btn.ref)
                    };
                };
                box.appendChild(del_btn);
                parentContainer.appendChild(box);
            }
        }).catch(error => console.error('Error:', error));
}

const delete_field = async (ref) => {
    const
        json = {uid: ref},
        body = JSON.stringify(json);

    const response = await fetch("/delete", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
        .then(response => response.text())
        .then(function (data) {
            window.alert("Data delete successful");
            window.location.reload();
        }).catch(error => console.error('Error:', error));
}

