// FRONT-END (CLIENT) JAVASCRIPT HERE

// Handle POST
async function submit(event) {
    event.preventDefault();

    const username = document.querySelector("#username").value,
        firstName = document.querySelector("#firstName").value,
        lastName = document.querySelector("#lastName").value,
        dob = document.querySelector("#dob").value,
        sex = document.querySelector("#sex").value,
        email = document.querySelector("#email").value,
        phone = document.querySelector("#phone").value,
        json = {
            username: username,
            firstName: firstName,
            lastName: lastName,
            dob: dob,
            sex: sex,
            email: email,
            phone: phone,
        },
        body = JSON.stringify(json);

    const response = await fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
    });

    //clear form fields
    document.querySelector("#firstName").value = "";
    document.querySelector("#lastName").value = "";
    document.querySelector("#dob").value = "";
    document.querySelector("#sex").value = "";
    document.querySelector("#email").value = "";
    document.querySelector("#phone").value = "";

    getApplications();
}

// Handle GET
async function getApplications() {
    const response = await fetch("/get");
    const data = await response.json();

    const display = document.querySelector("#results");
    display.innerHTML = "";

    data.forEach((item, index) => {
        if (item.username == document.querySelector("#username").value) {
            //from webware-d24-express, easier to display data
            let li = document.createElement("li");
            li.innerHTML = `
      Username: ${item.username} | 
      First Name: ${item.firstName} |
      Last Name: ${item.lastName} |
      Dob: ${item.dob} | 
      Sex: ${item.sex} | 
      Email: ${item.email} | 
      Phone #: ${item.phone} | 
      <button class="warning" onclick="updateApplication('${item.firstName}','${item.lastName}','${item.dob}','${item.sex}','${item.email}','${item.phone}','${item._id}')">Update</button>
      <button class="error" onclick="deleteApplication('${item._id}')">Delete</button>
    `;
            display.appendChild(li);
        }
    });
}

// Handle DELETE
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

// Handle UPDATE
async function updateApplication(
    firstName,
    lastName,
    dob,
    sex,
    email,
    phone,
    itemID
) {
    document.querySelector("#firstName").value = firstName;
    document.querySelector("#lastName").value = lastName;
    document.querySelector("#dob").value = dob;
    document.querySelector("#sex").value = sex;
    document.querySelector("#email").value = email;
    document.querySelector("#phone").value = phone;

    deleteApplication(itemID);
    getApplications();
}

// logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
    const response = await fetch("/logout");
    const data = await response.json();
    if (data.loggedOut) {
        window.location.href = "/";
    }
});

// remembers whos logged in
async function getUsername() {
    const response = await fetch("/username");
    const data = await response.json();
    document.querySelector("#username").value = data.currUser;
}

window.onload = function () {
    getUsername();
    document.querySelector("#applicationForm").onsubmit = submit;
    getApplications();
};
