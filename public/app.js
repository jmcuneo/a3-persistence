// FRONT-END (CLIENT) JAVASCRIPT HERE
// app.js

let currentEditingIndex = null;
let currentScores = [];

window.onload = async function() {
    await checkLoginStatus();
    await fetchScoresAndDisplay();

    const scoreForm = document.querySelector("form");
    if (scoreForm) {
        scoreForm.addEventListener("submit", submit);
    }
}

async function submit(event) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()

    const playerName = document.querySelector("#playerName").value;
    const scoreValue = document.querySelector("#score").value;
    const gameDate = document.querySelector("#gameDate").value;

    if (playerName && scoreValue && gameDate) {
        await addScore(playerName, Number(scoreValue), gameDate);
        alert('Score added successfully!');
    }
}

// submit the new score
async function addScore(playerName, score, gameDate) {
    console.log('Submitting score ing');

    const response = await fetch('/add-score', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ playerName, score, gameDate })
    });
    console.log('Response received', response);

    if (response.ok) {
        const data = await response.json();
        console.log('Data received', data);
        await getAndUpdateScores();
    } else {
        console.error('Failed to submit score');
    }
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
      Player: ${score.playerName},
      Score: ${score.score},
      Date: ${score.gameDate},
      Ranking: ${score.ranking}
      <button onclick="showEditForm('${score._id}', ${index})">Edit</button>
      <button onclick="deleteScore('${score._id}')" class="pure-button delete-button">Delete</button>
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

// handle the logout mechanism
document.getElementById('logoutButton').addEventListener('click', async () => {
    const response = await fetch('/logout');
    const data = await response.json();
    if (data.loggedOut) {
        window.location.href = '/'; // redirect to the login page
    }
});

// check if the status is logged in
async function checkLoginStatus() {
    const response = await fetch('/status');
    const data = await response.json();
    if (data.loggedIn) {
        document.getElementById('logoutForm').style.display = 'block';
        await fetchScoresAndDisplay(); // load scores if logged in
    } else {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('logoutForm').style.display = 'none';
    }
}

// fetch the scores and display after checking log in status
async function fetchScoresAndDisplay() {
    try {
        const response = await fetch('/get-scores');

        if (!response.ok) {
            throw new Error('Failed to fetch scores');
        }
        const scores = await response.json();
        updateScoreToDisplay(scores);
    } catch (error) {
        console.error('Error fetching scores:', error);
    }
}