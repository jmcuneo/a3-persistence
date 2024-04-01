// FRONT-END (CLIENT) JAVASCRIPT HERE

const logShift = async function (event) {
	// stop form submission from trying to load
	// a new .html page for displaying results...
	// this was the original browser behavior and still
	// remains to this day
	event.preventDefault()

	const form = document.getElementById("logForm");
	// define fields to receive from submission, and convert to json
	const shiftID = document.querySelector("#logShiftID"),
		shiftStart = document.querySelector("#shiftStart"),
		shiftEnd = document.querySelector("#shiftEnd"),
		json = { id: shiftID.value, start: shiftStart.value, end: shiftEnd.value },
		body = JSON.stringify(json);

	form.reset();
	// send the json as post request
	const response = await fetch("/shifts/add", {
		method: "POST",
		headers: { 'Content-Type': 'application/json' },
		body
	})

	// server responds with updated collection of appdata (all courses)
	const html = await response.text();
	document.body.innerHTML = html;
	// render courses to page
	// renderCourses(jsn);
}

const deleteShift = async function (event) {
	// stop form submission from trying to load
	// a new .html page for displaying results...
	// this was the original browser behavior and still
	// remains to this day
	event.preventDefault()

	// define fields to receive from removal, convert to json
	const cID = document.querySelector("#removeCID"),
		json = { cID: parseInt(cID.value) },
		body = JSON.stringify(json)

	// perform delete request using fields
	const response = await fetch("/courses/delete", {
		method: "DELETE",
		headers: { 'Content-Type': 'application/json' },
		body
	})

	// wait for server to respond, being an updated collection of data.
	// const text = await response.json()
	// renderCourses(text)
}

const renderCourses = function (json) {
	count = json.length;
	
	// go through all the courses, and render them to the tbody of the table.
	// essentially, we create a new tbody, put the data in new tbody and replace
	// the new tbody with the old tbody.
	if (count >= 1) {
		const courses = document.getElementById("courses");
		let oldTbody = courses.querySelector("tbody");
		const tbody = document.createElement('tbody');

		json.forEach(element => {
			let newRow = tbody.insertRow(-1);
			let idCell = newRow.insertCell(0);
			let nameCell = newRow.insertCell(1);
			let profCell = newRow.insertCell(2);
			let crnCell = newRow.insertCell(3);
			
			idCell.appendChild(document.createTextNode(element.cID));
			nameCell.appendChild(document.createTextNode(element.cName));
			profCell.appendChild(document.createTextNode(element.prof));
			crnCell.appendChild(document.createTextNode(element.crn));

		});

		courses.replaceChild(tbody, oldTbody);
	}
	else {
		const courses = document.getElementById("courses");
		const tbody = courses.querySelector("tbody");
		tbody.innerHTML = "";
	}
}

// bind buttons to respective functions
window.onload = function () {
	const log = document.querySelector("#logShift");
	const remove = document.querySelector("#removeShift");
	log.onclick = logShift;
	remove.onclick = deleteShift;
}