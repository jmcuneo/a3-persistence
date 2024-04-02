const submit = async function(event) {
  event.preventDefault();

  const input_name = document.querySelector("#name").value;
  const input_teammates = document.querySelector("#teammates").value;
  const input_points = document.querySelector("#points").value;

  console.log("Name:", input_name);
  console.log("Teammates:", input_teammates);
  console.log("Points:", input_points);

  const project = {
    name: input_name,
    teammates: input_teammates,
    points: input_points
  };

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
      await refreshProjectList();
      console.log("Project added:", data);
    } else {
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};



//Add project to html list
function addToList(data) {
  const projectList = document.createElement("ul");
  data.forEach(project => {
    const listItem = document.createElement("li");
    listItem.textContent = `Name: ${project.name}, Teammates: ${project.teammates}, Points: ${project.points}, Points Per Teammate: ${project.pointsPerTeammate}`;
    projectList.appendChild(listItem);
  });
  const list = document.querySelector("#dataList");
  list.innerHTML = "";
  list.appendChild(projectList);
}

const removeProject = async function(event) {
  event.preventDefault();

  const removeName = document.querySelector("#removeName").value;

  try {
    const response = await fetch("/remove", {
      method: "POST",
      body: JSON.stringify({ name: removeName }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      removeFromList(removeName);
      console.log("Project removed:", removeName);
    } else {
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

//Remove project from HTML list
function removeFromList(name) {
  const listItems = document.querySelectorAll("#dataList li");
  listItems.forEach(item => {
    if (item.textContent.includes(name)) {
      item.remove();
    }
  });
}

//Fetch all projects in the db
async function fetchProjects() {
  try {
    const response = await fetch("/docs");
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Error:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

function getUsername(req) {
  console.log()
  return req.session.username;

}

//Refreshes display of projects
async function refreshProjectList() {
  try {
    const response = await fetch("/docs");
    if (response.ok) {
      const projects = await response.json();
      addToList(projects);
    } else {
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}



//
window.onload = async function() {
  const projects = await fetchProjects();
  addToList(projects);

  const button = document.querySelector("button");
  button.onclick = submit;

  const removeButton = document.querySelector("#removeProject button[type=submit]");
  removeButton.onclick = removeProject;
};



