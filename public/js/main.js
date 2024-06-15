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
		shiftBrief = document.querySelector("#logBrief")
		json = { id: shiftID.value, start: shiftStart.value, end: shiftEnd.value, briefDesc: shiftBrief },
		body = JSON.stringify(json);

	form.reset();
	// send the json as post request
	const response = await fetch("/shifts/add", {
		method: "POST",
		headers: { 'Content-Type': 'application/json' },
		body
	})

	// server responds with updated website, put it on the page.
	const html = await response.text();
	document.body.innerHTML = html;
	window.location.reload();
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

	form.reset();

	// perform delete request (we use post bcuz per rfc, delete shouldnt have body)
	// 
	const response = await fetch("/shifts/delete", {
		method: "POST",
		headers: { 'Content-Type': 'application/json' },
		body
	})

	// await for response, render updated html
	const html = await response.text();
	document.body.innerHTML = html;
	window.location.reload();
}


// bind buttons to respective functions
window.onload = function () {
	const log = document.querySelector("#logShift");
	const remove = document.querySelector("#removeShift");
	log.onclick = logShift;
	remove.onclick = deleteShift;
}