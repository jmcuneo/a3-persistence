// FRONT-END (CLIENT) JAVASCRIPT HERE

const refreshData = async () => {
  const response = await fetch('/data');
  const data = await response.json();
  console.log("Data fetched from server:", data); // Log the fetched data

  const tableBody = document.querySelector('#data-table tbody');
  tableBody.innerHTML = ''; // Clear existing rows

  data.forEach((item) => {
    if (typeof item.model === 'string' &&
        typeof item.year === 'number' &&
        typeof item.mpg === 'number' &&
        typeof item.gallons === 'number') {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td contenteditable="true">${item.model}</td>
        <td contenteditable="true">${item.year}</td>
        <td contenteditable="true">${item.mpg}</td>
        <td contenteditable="true">${item.gallons}</td>
        <td class="action-cell">
          <button class="delete-button" onclick="deleteCar('${item._id.$oid}')">Delete</button>
          <button class="update-button" onclick="updateCar('${item._id.$oid}', this.parentElement.parentElement)">Update</button>
        </td>
      `;
      tableBody.appendChild(row);
    }
  });

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
  console.log("Updating car with _id:", _id);
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

window.onload = function () {
  document.querySelector('#data-form').onsubmit = addCar;
  document.querySelector('#refresh-button').onclick = refreshData;
  refreshData(); // Load initial data
};
