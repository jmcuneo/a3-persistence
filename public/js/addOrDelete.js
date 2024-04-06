// FRONT-END (CLIENT) JAVASCRIPT HERE

const add = async function( event ) {
  const team1 = document.querySelector("#team1").value;
  const team2 = document.querySelector("#team2").value;
  const score1 = parseInt(document.querySelector("#score1").value);
  const score2 = parseInt(document.querySelector("#score2").value);

  if (team1 !== '' && team2 !== '' && score2 && score1) {

    const body = JSON.stringify({team1: team1, team2: team2, score1: score1, score2: score2});

    document.querySelector("#team1").value = '';
    document.querySelector("#team2").value = '';
    document.querySelector("#score1").value = '';
    document.querySelector("#score2").value = '';

    await fetch("/api/game", {
      method: "POST",
      body
    });

    await updateTable();
  }
}

const deleteData = async function( event ) {
  const team1 = document.querySelector("#team1").value;
  const team2 = document.querySelector("#team2").value;
  const score1 = parseInt(document.querySelector("#score1").value);
  const score2 = parseInt(document.querySelector("#score2").value);

  if (team1 !== '' && team2 !== '' && score2 && score1) {
    const body = JSON.stringify({team1: team1, team2: team2, score1: score1, score2: score2});
    document.querySelector("#team1").value = '';
    document.querySelector("#team2").value = '';
    document.querySelector("#score1").value = '';
    document.querySelector("#score2").value = '';
    const response = await fetch("/api/game", {
      method: "DELETE",
      body
    });

    const text = await response.text()

    updateTable();
  }
}

const updateTable = async function () {
  fetch("/api/game", {
    method: "GET"
  }).then(response => response.json())
      .then(data => buildTable(data));
}

function buildTable(data) {
  let table = "";
  table += "<table border='3' id='gameTable'><tr><th>Team1</th><th>Team2</th><th>Score1</th><th>Score2</th><th>Winner</th></tr>"
  if (data[0] !== '') {
    for (let i = 0; i < data.length; i++) {
      table += "<tr onclick='setGame(" + i + ")'>";
      const row = (data[i]);
      table += "<td>" + row.team1 + "</td><td>" + row.team2 + "</td><td>" + row.score1 + "</td><td>" + row.score2 + "</td><td>" + row.winner + "</td>";
    }
  }
  table += "</table>";
  document.getElementById("tableDiv").innerHTML = table;
}

function setGame(data) {
  const cells = document.getElementsByTagName("td");
  document.querySelector("#team1").value = cells[data*5].innerHTML;
  document.querySelector("#team2").value = cells[data*5+1].innerHTML;
  document.querySelector("#score1").value = cells[data*5+2].innerHTML;
  document.querySelector("#score2").value = cells[data*5+3].innerHTML;
}

window.onload = async function() {
  document.querySelector("#logout").onclick = logout;
  document.querySelector("#add").onclick = add;
  document.querySelector("#delete").onclick = deleteData;
  await updateTable();

}