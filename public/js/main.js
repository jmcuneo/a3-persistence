// FRONT-END (CLIENT) JAVASCRIPT HERE
let selectedItem = 0;

function screenToView() {
    const makeWorkOutWindow = document.getElementById("make-workout-window");
    const viewWorkoutWindow = document.getElementById("view-workout-window");
    const editWorkoutWindow = document.getElementById("edit-workout-window");

    if (editWorkoutWindow.style.display === "none" || makeWorkOutWindow.style.display === "none") {
        makeWorkOutWindow.style.display = "none";
        editWorkoutWindow.style.display = "none"
        viewWorkoutWindow.style.display = "flex";
    }
}

function screenToMake() {
    const makeWorkOutWindow = document.getElementById("make-workout-window");
    const viewWorkoutWindow = document.getElementById("view-workout-window");
    const editWorkoutWindow = document.getElementById("edit-workout-window");

    if (viewWorkoutWindow.style.display === "none" || editWorkoutWindow.style.display === "none") {
        viewWorkoutWindow.style.display = "none";
        editWorkoutWindow.style.display = "none"
        makeWorkOutWindow.style.display = "flex";
    }
}

async function deleteWorkout() {
    const json = {
        uuid: localStorage.getItem('sessionToken'),
        postId: selectedItem
    }

    const response = await fetch("/delete",
        {
            method: "POST",
            body: JSON.stringify(json)
        }).then(response => {
        console.log(response);
    })

    fetch("/delete/" + selectedItem,
        {
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(data => {
            populateSidebar();
            populateTable();
            window.location.href = '/workout.html';
        })
        .catch(error => {
            console.error(error)
        })

}

async function editWorkout() {
    const titleInput = document.getElementById("title-edit")
    const descInput = document.getElementById("description-edit")
    const typeInput = document.getElementById("workoutType-edit")
    const json = {
        title: titleInput.value,
        description: descInput.value,
        type: typeInput.value,
        uuid: localStorage.getItem('sessionToken'),
        postId: selectedItem
    }

    console.log(json);
    const response = await fetch("/edit_workout",
        {
            method: "POST",
            body: JSON.stringify(json)
        }).then(response => {
        console.log(response);
    })

    populateSidebar();
    populateTable();
    screenToMake();
}

async function screenToEdit(elementId) {

    selectedItem = elementId;
    const makeWorkOutWindow = document.getElementById("make-workout-window");
    const viewWorkoutWindow = document.getElementById("view-workout-window");
    const editWorkoutWindow = document.getElementById("edit-workout-window");

    if (makeWorkOutWindow.style.display === "none" || viewWorkoutWindow.style.display === "none") {
        makeWorkOutWindow.style.display = "none";
        viewWorkoutWindow.style.display = "none";
        editWorkoutWindow.style.display = "flex"
    }

    const json = {
        uuid: localStorage.getItem('sessionToken')
    }
    const response = await fetch("/get_workouts",
        {
            method: "POST",
            body: JSON.stringify(json)
        })
        .then(res => res.json())
        .then(data => {
            const workout = data[elementId];
            const titleEntry = document.getElementById("title-edit");
            const descEntry = document.getElementById("description-edit");
            const typeEntry = document.getElementById("workoutType-edit")
            console.log(workout.workout_type);
            typeEntry.value = workout.workout_type;
            titleEntry.value = workout.workout_title;
            descEntry.value = workout.workout_description;
        })
        .catch(error => {
            console.error(error);
        })
}

async function populateTable() {
    const json = {
        uuid: localStorage.getItem('sessionToken')
    }
    const response = await fetch("/get_workouts",
        {
            method: "POST",
            body: JSON.stringify(json)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const tableBody = document.getElementById("table-body");
            tableBody.innerHTML = ""
            data.forEach(workout => {
                const row = tableBody.insertRow();

                const title = row.insertCell(0);
                const desc = row.insertCell(1);
                const time = row.insertCell(2);

                title.textContent = workout.workout_title;
                desc.textContent = workout.workout_description;
                time.textContent = workout.workout_type;
            })

        })
        .catch(error => {
            console.error("ERROR: " + error);
        })
}


async function populateSidebar() {

    const json = {
        uuid: localStorage.getItem('sessionToken')
    }
    const response = await fetch("/get_workouts",
        {
            method: "POST",
            body: JSON.stringify(json)
        })
        .then(res => res.json())
        .then(data => {
            const sidebar = document.getElementById("workout-list");
            let id = 0;
            sidebar.innerHTML = "";
            data.forEach(workout => {
                const sidebarElement = document.createElement('div');
                sidebarElement.classList.add('sidebar-entry', 'bg-dark', 'text-white', 'rounded-5');
                sidebarElement.innerText = workout.workout_title;
                sidebarElement.id = id;
                sidebarElement.addEventListener("click", () => {
                    screenToEdit(sidebarElement.id);
                })
                id += 1;
                sidebar.appendChild(sidebarElement);
            })

        })
        .catch(error => {
            console.error("ERROR: " + error);
        })
}

const createWorkout = async function (event) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    //   event.preventDefault();
    const titleInput = document.getElementById("title")
    const descInput = document.getElementById("description")
    const typeInput = document.getElementById("workoutType")
    const json = {
        title: titleInput.value,
        description: descInput.value,
        type: typeInput.value,
        uuid: localStorage.getItem('sessionToken'),
    }

    console.log(json);
    const response = await fetch("/create_workout",
        {
            method: "POST",
            body: JSON.stringify(json)
        }).then(response => {
        console.log(response);
    })

    titleInput.value = ""
    descInput.value = ""
    const text = await response.text();
    console.log(text);
    populateTable();
    populateSidebar();
}

window.onload = function () {
    console.log("Loading | Session Token: " + localStorage.getItem('sessionToken'));
    populateTable();
    populateSidebar();
    const submitButton = document.getElementById("submit-button");
    const newListButton = document.getElementById("make-workout");
    const viewWorkoutButton = document.getElementById("view-workout");
    const editButton = document.getElementById("edit-button");
    const deleteButton = document.getElementById("delete-button");


    newListButton.addEventListener("click", () => {
        screenToMake()
    });
    viewWorkoutButton.addEventListener("click", () => {
        screenToView()
    });
    editButton.addEventListener("click", () => {
        editWorkout()
    });
    deleteButton.addEventListener("click", () => {
        deleteWorkout()
    });
    submitButton.addEventListener("click", () => {
        createWorkout()
    });


    // Login Page


}


