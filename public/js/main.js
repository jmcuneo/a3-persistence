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

	const form = document.getElementById("removeForm");

	// define fields to receive from removal, convert to json
	const removeID = document.querySelector("#shiftID"),
		json = { removeID: removeID.value },
		body = JSON.stringify(json)

	console.log(body);
	// perform delete request using fields
	const response = await fetch("/shifts/delete", {
		method: "POST",
		headers: { 'Content-Type': 'application/json' },
		body
	})

	form.reset();

	const html = await response.text();
	document.body.innerHTML = html;
}


// bind buttons to respective functions
window.onload = function () {
	const log = document.querySelector("#logShift");
	const remove = document.querySelector("#removeShift");
	log.onclick = logShift;
	remove.onclick = deleteShift;
}