const { connect, database } = require("../db/connection");

const getNextID = async function() {
	const db = database();
	const userColl = db.collection("user-data");
	const userQuery = { user: req.user.username }
	let nextID = -1;
	userColl.find(userQuery).toArray((err, result) => {
		if (err) throw err;
		if (result) {
			// user already exists;
			nextID = (result.idLast) + 1;
			const original = {_id: result._id};
			const newValues = { $set: {idLast: nextID}} 
			userColl.updateOne(original, newValues, (err, res) => {
				if (err) throw err;
				console.log("1 doc updated");
			})

		} else {
			// user does not exist
			userColl.insertOne({user: req.user.username, idLast: 0})
			nextID = 0;
		}
	});
	return nextID;
}


