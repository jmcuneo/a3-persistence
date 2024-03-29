// FRONT-END (CLIENT) JAVASCRIPT HERE

let currentEditingIndex = null;
let currentScores = [];

window.onload = async function() {
    try {
        // use this to help me to fetch 'appdata' in server side to client side
        const response = await fetch("/get-scores");
        const scores = await response.json();
        updateScoreToDisplay(scores);
    } catch (error) {
        console.error('Error fetching scores:', error);
    }

    const submitButton = document.querySelector("button");
    submitButton.onclick = submit;
}

async function submit(event) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()

    const playerName = document.querySelector("#playerName").value;
    const scoreValue  = document.querySelector("#score").value;
    const gameDate = document.querySelector("#gameDate").value;
    //json = { action: "add", playerName: playerName, score: Number(score), gameDate: gameDate},
    //body = JSON.stringify(json);

    // submit the new score
    await addScore(playerName, Number(scoreValue), gameDate);
}

// submit the new score
async function addScore(playerName, score, gameDate) {
    const response = await fetch('/add-score', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ playerName, score, gameDate })
    });
    const data = await response.json();

    await getAndUpdateScores();
}

/**
 * delete the score and display it
 */
async function deleteScore(scoreId) {
    await fetch('/delete-score', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ _id: scoreId })
    });

    await getAndUpdateScores();
}

// modify the dataset
async function modifyScore(scoreId, playerName, score, gameDate) {
    await fetch('/modify-score', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ _id: scoreId, playerName, score, gameDate })
    });

    await getAndUpdateScores();
}

// fetch the score after modification
async function getAndUpdateScores() {
    const response = await fetch('/get-scores');
    const scores = await response.json();

    updateScoreToDisplay(scores);
    return scores;
}


/**
 * a function to render scores inside the '#scoreDisplay' to display
 * include 'add', 'delete' and 'modify' display
 * @param scores are the inputted scores
 */
function updateScoreToDisplay(scores){
    scores.sort((a, b) => b.score - a.score);

    const display = document.querySelector('#scoreDisplay');
    // clear the current content
    display.innerHTML = '';

    scores.forEach((score, index) => {
        score.ranking = index + 1;
        const scoreElement = document.createElement('div');
        scoreElement.innerHTML =
            `
      Player: ${score.playerName}, Score: ${score.score}, Date: ${score.gameDate}, Ranking: ${score.ranking}
      <button onclick="deleteScore('${score._id}')">Delete</button>
      <button onclick="showEditForm('${score._id}', ${index})">Edit</button>
    `;
        display.appendChild(scoreElement);
    });
    currentScores = scores;
}


/**
 * accept the score's index to identify which score to edit and modify
 */
async function showEditForm(scoreId, index) {
    const score = await getScoreById(scoreId);

    if (score) {
        document.querySelector("#editPlayerName").value = score.playerName;
        document.querySelector("#editScore").value = score.score;
        document.querySelector("#editGameDate").value = score.gameDate;
        document.querySelector("#editForm").style.display = "block";
        currentEditingIndex = index;
    }
}

// get the specific by ObjectID
async function getScoreById(scoreId) {
    const response = await fetch('/get-scores');
    const scores = await response.json();
    return scores.find(score => score._id === scoreId);
}

/**
 * function to submit the modify(edit)
 */
async function submitEdit() {
    const playerName = document.querySelector("#editPlayerName").value;
    const score = document.querySelector("#editScore").value;
    const gameDate = document.querySelector("#editGameDate").value;

    //const scores = await getAndUpdateScores();
    const scoreId = currentScores[currentEditingIndex]._id;

    await modifyScore(scoreId, playerName, Number(score), gameDate);
    // this will hide the edit form
    cancelEdit();
}

/**
 * cancel the edit and hide the edit form
 */
function cancelEdit() {
    document.querySelector("#editForm").style.display = "none";
}