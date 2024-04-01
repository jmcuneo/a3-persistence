const { connect, database } = require("../db/connection");

const getNextID = async function(username) {
	const db = database();
	const userColl = db.collection("user-data");
	const userQuery = { user: username }
	let nextID = -1;
	await userColl.findOne(userQuery).toArray((err, result) => {
		if (err) throw err;
		console.log(result);
		if (result) {
			// user already exists;
			console.log("i am here");
			nextID = (result.idLast) + 1;
			const original = {_id: result._id};
			const newValues = { $set: {idLast: nextID}} 
			userColl.updateOne(original, newValues, (err, res) => {
				if (err) throw err;
				console.log("1 doc updated");
			})

		} else {
			// user does not exist
			userColl.insertOne({user: username, idLast: 0})
			nextID = 0;
		}
	});
	return nextID;
}

module.exports = { getNextID }


