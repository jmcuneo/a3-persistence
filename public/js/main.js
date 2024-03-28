
// FRONT-END (CLIENT) JAVASCRIPT HERE

const refreshData = async () => {
  try {
    const response = await fetch('/data', {
      credentials: 'include' // Include credentials in the request
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Data fetched from server:", data); // Log the fetched data

    const tableBody = document.querySelector('#data-table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    data.forEach((item) => {
      // Check if the item has all four required properties
      if (item.model && item.year && item.mpg && item.gallons) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td contenteditable="true">${item.model}</td>
          <td contenteditable="true">${item.year}</td>
          <td contenteditable="true">${item.mpg}</td>
          <td contenteditable="true">${item.gallons}</td>
          <td class="action-cell">
            <button class="delete-button" onclick="deleteCar('${item._id}')">Delete</button>
            <button class="update-button" onclick="updateCar('${item._id}', this.parentElement.parentElement)">Update</button>
          </td>
        `;
        tableBody.appendChild(row);
      }
    });
  } catch (error) {
    console.error('Failed to refresh data:', error);
    // Handle the error appropriately in your UI
  }
};

const addCar = async (event) => {
  event.preventDefault();

  const model = document.querySelector('#model').value;
  const year = document.querySelector('#year').value;
  const mpg = document.querySelector('#mpg').value;
  const gallons = document.querySelector('#gallons').value;

  try {
    const response = await fetch('/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, year, mpg, gallons })
    });

    if (!response.ok) {
      throw new Error(`Failed to add car: ${response.status} ${response.statusText}`);
    }

    refreshData(); // Refresh the data after adding a car
  } catch (error) {
    console.error("Failed to add car:", error);
  }
};

const updateCar = async (_id, row) => {
  const updatedData = {
    model: row.children[0].innerText,
    year: parseInt(row.children[1].innerText),
    mpg: parseInt(row.children[2].innerText),
    gallons: parseInt(row.children[3].innerText)
  };

  if (isNaN(updatedData.year) || isNaN(updatedData.mpg) || isNaN(updatedData.gallons)) {
    alert("Please enter valid numbers for year, mpg, and gallons.");
    return;
  }

  const response = await fetch('/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _id: _id, updatedData: updatedData })
  });

  if (response.ok) {
    refreshData();
  }
};

const deleteCar = async (_id) => {
  const response = await fetch('/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _id: _id })
  });

  if (response.ok) {
    refreshData();
  }
};


const updateUsernameDisplay = (username) => {
  const usernameSpan = document.getElementById('username');
  usernameSpan.textContent = username;
};

// Update the username display based on the logged-in user
fetch('/username')
  .then(response => response.json())
  .then(data => {
      updateUsernameDisplay(data.username);
  });

  const submitSurvey = async () => {
    const firstCar = document.getElementById('first-car').value;
    const intro = document.getElementById('intro').value;
    const likeCars = document.getElementById('like-cars').checked;
    const bodyStyle = document.querySelector('input[name="bodyStyle"]:checked').value;
    const fuelType = document.getElementById('fuel-type').value;

    try {
        const response = await fetch('/submit-survey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstCar, intro, likeCars, bodyStyle, fuelType })
        });
        if (response.ok || response.redirected) {
            alert('Survey submitted successfully.');
            window.location.href = response.url; // Redirect to the new URL
        } else {
            const data = await response.json();
            alert('Failed to submit survey: ' + data.error);
        }
    } catch (error) {
        console.error('Failed to submit survey:', error);
        alert('Failed to submit survey. Please try again later.');
    }
};



// Assign the submitSurvey function to the form's submit event


  
  window.onload = function () {
    document.querySelector('#data-form').onsubmit = addCar; // Add this line to submit survey data
    document.querySelector('#refresh-button').onclick = refreshData;
    refreshData(); // Load initial data
  };
  
  const surveyForm = document.getElementById('survey-form');
  const submitButton = document.getElementById('submit-survey');
  if (surveyForm && submitButton) {
      submitButton.addEventListener('click', submitSurvey);
  }