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
            table += "<tr>";
            const row = (data[i]);
            table += "<td>" + row.team1 + "</td><td>" + row.team2 + "</td><td>" + row.score1 + "</td><td>" + row.score2 + "</td><td>" + row.winner + "</td>";
        }
    }
    table += "</table>";
    document.getElementById("tableDiv").innerHTML = table;
}

window.onload = async function() {
    await updateTable();
}