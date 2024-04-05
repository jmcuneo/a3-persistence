async function submit(event) {
    event.preventDefault();
  
    const task = document.querySelector("#task").value,
      priority = document.querySelector("#priority").value,
      dueDate = document.querySelector("#dueDate").value, 
      json = {
        task: task,
        priority: priority,
        dueDate: dueDate 
      },
      body = JSON.stringify(json);
  
    const response = await fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
  
    document.querySelector("#task").value = "";
    document.querySelector("#priority").value = "";
    document.querySelector("#dueDate").value = "";
    getApplications();
  }
  
  async function getApplications() {
    const response = await fetch("/get");
    const data = await response.json();
  
    const tableBody = document.querySelector("#results tbody");
    tableBody.innerHTML = ""; 
  
    data.forEach((item, index) => {
      let row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.task}</td>
        <td>${item.priority}</td>
        <td>${item.dueDate}</td>
        <td>
          <button class="button" onclick="updateApplication('${item._id}')">Update</button>
          <button class="button" onclick="deleteApplication('${item._id}')">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  
  async function deleteApplication(itemID) {
    const json = { _id: itemID },
      body = JSON.stringify(json);
    await fetch("/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    getApplications();
  }
  
  async function updateApplication(itemID) {
    const updatedTask = prompt("Enter updated task:");
    if (updatedTask !== null && updatedTask !== "") {
      const updatedPriority = prompt("Enter updated priority:");
      const updatedDueDate = prompt("Enter updated due date:");
      const json = { _id: itemID, task: updatedTask, priority: updatedPriority, dueDate: updatedDueDate },
        body = JSON.stringify(json);
      await fetch("/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      getApplications();
    }
  }
  
  window.onload = function () {
    document.querySelector("#taskForm").addEventListener("submit", submit);
    getApplications();
  };
  