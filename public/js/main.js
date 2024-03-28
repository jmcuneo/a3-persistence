// FRONT-END (CLIENT) JAVASCRIPT HERE

let currentEditingIndex = null;

const submit = async function( event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()

    const playerName = document.querySelector("#playerName").value,
        score = document.querySelector("#score").value,
        gameDate = document.querySelector("#gameDate").value,
        json = { action: "add", playerName: playerName, score: Number(score), gameDate: gameDate},
        body = JSON.stringify(json);

    await fetch( "/submit", {
        method:"POST",
        headers:{'Content-Type': 'application/json'},
        body
    }).then(response => response.json())
        .then(json => {
            console.log(json);
            updateScoreToDisplay(json); // this will update the new dataset to display
        })
        .catch(error => console.error('Error: ', error));
}

window.onload = async function() {
    try {
        // use this to help me to fetch 'appdata' in server side to client side
        const response = await fetch("/get-scores");
        const scores = await response.json();
        updateScoreToDisplay(scores);
    } catch (error) {
        console.error('Error fetching scores:', error);
    }

    const button = document.querySelector("button");
    button.onclick = submit;
}

/**
 * a function to render scores inside the '#scoreDisplay' to display
 * include 'add', 'delete' and 'modify' display
 * @param scores are the inputted scores
 */
function updateScoreToDisplay(scores){
    const display = document.querySelector('#scoreDisplay');

    // to clear the current content
    display.innerHTML = '';

    scores.forEach((score, index) => {
        const scoreElement = document.createElement('div');
        scoreElement.innerHTML =
            `
      Player: ${score.playerName}, Score: ${score.score}, Date: ${score.gameDate}, Ranking: ${score.ranking}
      <button onclick="deleteScore('${score.playerName}')">Delete</button>
      <button onclick="showEditForm(${index})">Edit</button>
    `;
        display.appendChild(scoreElement);
    });
}

/**
 * delete the score and display it
 * @param playerName
 */
async function deleteScore(playerName) {
    await fetch('/submit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({action: 'delete', playerName})
    }).then(response => response.json())
        .then(json => {
            updateScoreToDisplay(json);
        });
}


/**
 * accept the score's index to identify which score to edit and modify
 */
async function showEditForm(index) {
    // fetch the latest scores array
    const response = await fetch("/get-scores");
    const scores = await response.json();

    const score = scores[index];
    document.querySelector("#editPlayerName").value = score.playerName;
    document.querySelector("#editScore").value = score.score;
    document.querySelector("#editGameDate").value = score.gameDate;

    document.querySelector("#editForm").style.display = "block";
    // keep track of the current editing index globally
    currentEditingIndex = index;
}

/**
 * function to submit the modify(edit)
 */
async function submitEdit() {
    const playerName = document.querySelector("#editPlayerName").value;
    const score = document.querySelector("#editScore").value;
    const gameDate = document.querySelector("#editGameDate").value;

    await fetch("/submit", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            action: "modify",
            playerName,
            score: Number(score),
            gameDate,
            index: currentEditingIndex // identify which score to update
        })
    })
        .then(response => response.json())
        .then(json => {
            updateScoreToDisplay(json);
            document.querySelector("#editForm").style.display = "none";
        })
        .catch(error => console.error('Error:', error));
}

/**
 * cancel the edit
 */
function cancelEdit() {
    document.querySelector("#editForm").style.display = "none";
}