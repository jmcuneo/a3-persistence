// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {

  event.preventDefault()
  
  const game = document.querySelector( "#game" ).value,
        name = document.querySelector( "#name" ).value,
        uid = document.querySelector( "#uid" ).value,
        json = {game: game, name: name, uid: uid},
        body = JSON.stringify(json);

  const response = await fetch( "/submit", {
    method:"POST",
    body 
  }).then(response => response.json())
    .then(function (data){

    let form = document.getElementById("form");
    console.log(data)
    while (form.lastElementChild) {
      form.removeChild(form.lastElementChild);
    }

      for (let i = 0; i < data.length; i++) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode("Game: " + data[i].game + ",   Nickname: " + data[i].name + ",   UID: " + data[i].uid + ",   Server: " + data[i].server))
        form.appendChild(div);
      }
  });
}

window.onload = async function () {
  const button = document.querySelector("button");
  button.onclick = submit;
}