// FRONT-END (CLIENT) JAVASCRIPT HERE

const add = async function( event ) {
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    if (username !== '' && password !== '') {
        const body = JSON.stringify({username: username, password: password});
        console.log(body);
        document.querySelector("#username").value = '';
        document.querySelector("#password").value = '';

        await fetch("/api/user", {
            method: "POST",
            body
        });

        await updateTable();
    }
}

const deleteData = async function( event ) {
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    if (username !== '' && password !== '') {
        const body = JSON.stringify({username: username, password: password});
        console.log(body);
        document.querySelector("#username").value = '';
        document.querySelector("#password").value = '';
        await fetch("/api/user", {
            method: "DELETE",
            body
        });

        updateTable();
    }
}

const updateTable = async function () {
    fetch("/api/user", {
        method: "GET"
    }).then(response => response.json())
        .then(data => buildTable(data));
}

function buildTable(data) {
    console.log(data)
    let table = "";
    table += "<table border='3' id='gameTable'><tr><th>Username</th></tr>"
    if (data[0] !== '') {
        for (let i = 0; i < data.length; i++) {
            table += "<tr onclick='setGame(" + i + ")'>";
            const row = (data[i]);
            table += "<td>" + row.username + "</td>";
        }
    }
    table += "</table>";
    document.getElementById("tableDiv").innerHTML = table;
}

function setGame(data) {
    const cells = document.getElementsByTagName("td");
    document.querySelector("#username").value = cells[data].innerHTML;
    document.querySelector("#password").value = '';
}

window.onload = async function() {
    document.querySelector("#logout").onclick = logout;
    document.querySelector("#add").onclick = add;
    document.querySelector("#delete").onclick = deleteData;
    await updateTable();

}