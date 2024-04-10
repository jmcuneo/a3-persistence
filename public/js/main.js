// FRONT-END (CLIENT) JAVASCRIPT HERE

const fetchData = async function () {
  return await fetch("/docs", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    return response.json();
  });
};

const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  switch (event.target.id) {
    case "btn_add":
      addDoc();
      break;
    case "btn_edit":
      edit();
      break;
    case "btn_logout":
      logout();
      break;
    default:
      console.log(event.target.id);
  }
};

// Adds a new doc to the database with the data in the add form
// and refreshes the data table
const addDoc = async function () {
  const input = document.getElementById("add_form");
  const json = {
    dept_code: input.dept_code.value,
    course_id: input.course_id.value,
    professor: input.professor.value,
    grade: input.grade.value,
    notes: input.notes.value,
  };
  input.reset();
  const response = await fetch("/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  });

  if (document.querySelector("table").hasChildNodes()) {
    await newTableBody().then((tbody) => {
      document.querySelector("table").lastChild.replaceWith(tbody);
    });
  }
};

// Removes the doc with the given ID from the database
// and refreshes the data table
const removeDoc = async function (id) {
  const json = { _id: id };
  const response = await fetch("/remove", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  });

  if (document.querySelector("table").hasChildNodes()) {
    await newTableBody().then((tbody) => {
      document.querySelector("table").lastChild.replaceWith(tbody);
    });
  }
};

const openEditForm = async function (
  _id,
  dept_code,
  course_id,
  professor,
  grade,
  notes
) {
  const json = {
    _id: _id,
    dept_code: dept_code,
    course_id: course_id,
    professor: professor,
    grade: grade,
    notes: notes,
  };

  const curr_edit_form = document.getElementById("edit_form");

  const selected = { a: "", b: "", c: "", nr: "" };
  if (json.grade === "B") selected.b = "selected";
  else if (json.grade === "C") selected.c = "selected";
  else if (json.grade === "NR") selected.nr = "selected";
  else selected.a = "selected";

  const edit_form = document.createElement("form");
  edit_form.id = "edit_form";
  edit_form.className = "pure-form pure-form-aligned";
  edit_form.innerHTML = `
    <fieldset>
    <legend>Editing course information</legend>
      <input
        name="_id"
        id="edit_id"
        type="hidden"
        value="${json._id}"
      />
      <div class="pure-control-group">
        <label for="edit_dept">Department</label>
        <input
          name="dept_code"
          id="edit_dept"
          type="text"
          maxlength="4"
          value="${json.dept_code}"
          required
          pattern="[A-Z]*"
          autocomplete="off"
          class="pure-input-2-5"
        />
      </div>
      <div class="pure-control-group">
        <label for="edit_cid">Course Number</label>
        <input
          name="course_id"
          id="edit_cid"
          type="text"
          inputmode="number"
          maxlength="4"
          value="${json.course_id}"
          required
          pattern="[0-9]*"
          autocomplete="off"
          class="pure-input-2-5"
        />
      </div>
      <div class="pure-control-group">
        <label for="edit_prof">Professor</label>
        <input
          name="professor"
          id="edit_prof"
          type="text"
          value="${json.professor}"
          autocomplete="off"
          class="pure-input-2-5"
        />
      </div>
      <div class="pure-control-group">
        <label for="grade">Grade</label>
        <select id="grade" class="pure-input-1-5">
          <option ${selected.a}>A</option>
          <option ${selected.b}>B</option>
          <option ${selected.c}>C</option>
          <option ${selected.nr}>NR</option>
        </select>
      </div>
      <div class="pure-control-group">
        <label for="notes">Comments</label>
        <textarea
          name="notes"
          id="notes"
          rows="3"
          cols="22"
        >${json.notes}</textarea>
      </div>
      <div class="pure-controls">
        <button id="btn_edit" class="pure-button pure-button-primary" >Apply changes</button>
      </div>
    </fieldset>`;
  if (curr_edit_form === null) {
    document.querySelector(".content").appendChild(edit_form);
  } else {
    curr_edit_form.replaceWith(edit_form);
  }
  document.getElementById("btn_edit").onclick = submit;
};

// Updates a doc to the data in the edit form
// and refreshes the data table
const edit = async function () {
  const input = document.getElementById("edit_form");
  const json = {
    _id: input._id.value,
    dept_code: input.dept_code.value,
    course_id: input.course_id.value,
    professor: input.professor.value,
    grade: input.grade.value,
    notes: input.notes.value,
  };

  const response = await fetch("/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  });

  if (document.querySelector("table").hasChildNodes()) {
    await newTableBody().then((tbody) => {
      document.querySelector("table").lastChild.replaceWith(tbody);
    });
  }
  input.remove();
};

const toggleTable = async function () {
  var table = document.querySelector("table");

  if (table.hasChildNodes()) {
    let new_table = document.createElement("table");
    new_table.className = "pure-table pure-table-horizontal";
    table.parentNode.replaceChild(new_table, table);
  } else {
    var thead = document.createElement("thead");

    var tr = thead.insertRow();
    var td = tr.insertCell();
    td.innerHTML = "Course";
    var td = tr.insertCell();
    td.innerHTML = "Professor";
    var td = tr.insertCell();
    td.innerHTML = "Grade";
    var td = tr.insertCell();
    td.innerHTML = "Notes";

    const tbody = await newTableBody();
    table.appendChild(thead);
    table.appendChild(tbody);
  }
};

const newTableBody = async function () {
  const data = await fetchData();
  var tr, td;
  var tbody = document.createElement("tbody");

  for (var i = 0; i < data.length; i++) {
    tr = tbody.insertRow(tbody.rows.length);
    td = tr.insertCell();
    td.innerHTML = data[i].dept_code + data[i].course_id;
    td = tr.insertCell();
    td.innerHTML = data[i].professor;
    td = tr.insertCell();
    td.innerHTML = data[i].grade;
    td = tr.insertCell();
    if (data[i].notes.length < 16) td.innerHTML = data[i].notes;
    else td.innerHTML = data[i].notes.slice(0, 15) + "...";
    td = tr.insertCell();
    td.innerHTML = `<button class="button-edit" id="edit_${data[i]._id}" onclick="openEditForm('${data[i]._id}', '${data[i].dept_code}', '${data[i].course_id}', '${data[i].professor}', '${data[i].grade}', '${data[i].notes}')">edit</button>`;
    td = tr.insertCell();
    td.innerHTML = `<button class="button-remove" id="remove_${data[i]._id}" onclick="removeDoc('${data[i]._id}')">remove</button>`;
  }
  return tbody;
  /*
  await newTableBody().then((tbody) => {
    document.querySelector("table").lastChild.replaceWith(tbody);
  });
  */
};

const logout = async function () {
  const response = await fetch("/logout", { method: "POST" });
};

window.onload = function () {
  document.querySelector("#btn_add").onclick = submit;
  document.querySelector("#btn_table").onclick = toggleTable;
  //document.querySelector("#btn_logout").onclick = logout;
};
