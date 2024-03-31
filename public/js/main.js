const submit = async function(event) {
  event.preventDefault();

  const input_name = document.querySelector("#name").value;
  const input_teammates = document.querySelector("#teammates").value;
  const input_points = document.querySelector("#points").value;

  const project = { name: input_name, teammates: input_teammates, points: input_points };

  try {
    const response = await fetch("/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(project)
    });

    if (response.ok) {
      const data = await response.json();
      addToList(data);
      console.log("Project added:", data);
    } else {
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

//Add project to HTML list
function addToList(data) {
  console.log("Adding to list");
  const newProject = data[data.length - 1]; // Assuming the new project is the last element in the array
  const listItem = document.createElement("li");
  listItem.textContent = JSON.stringify(newProject);

  const list = document.querySelector("#dataList");
  list.appendChild(listItem);
}

const removeProject = async function(event) {
  event.preventDefault();

  const removeName = document.querySelector("#removeName").value;

  if (removeName === "") return; // Do nothing if empty name is submitted

  try {
    const response = await fetch("/remove", { //Changed from delete to remove
      method: "POST",
      body: JSON.stringify({ name: removeName }),
      headers: {
        "Content-Type": "application/json" // Specify JSON content type
      }
    });

    if (response.ok) {
      // If response is successful, remove the project from the list
      removeFromList(removeName);
      console.log("Project removed:", removeName);
    } else {
      // Handle error response
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const removeFromList = function(name) {
  const listItems = document.querySelectorAll("#dataList li");
  listItems.forEach(function(item) {
    if (item.textContent.includes(name)) {
      item.remove();
    }
  });
};

//


window.onload = function() {
  const button = document.querySelector("button");
  button.onclick = submit;

  const removeButton = document.querySelector("#removeProject button[type=submit]");
  removeButton.onclick = removeProject;
};

