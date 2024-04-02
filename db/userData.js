const { connect, database } = require("../db/connection");

const getNextID = async function(username) {
	const db = database();
	const userColl = db.collection("user-data");
	const userQuery = { user: username }
	let nextID = -1;

	const user = await userColl.findOne(userQuery).then(async (doc) => {
		if (!doc) {
			await userColl.insertOne({user: username, idLast: 0})
			nextID = 0;
		} else {
			nextID = (user.idLast) + 1;
			const original = {_id: user._id};
			const newVals = { $set: { idLast: nextID }};
		 	await userColl.updateOne(original, newVals);
		}
	});
	
	// if (user) {
	// 	nextID = (user.idLast) + 1;
	// 	const original = {_id: user._id};
	// 	const newVals = { $set: { idLast: nextID }};
	// 	const result = await userColl.updateOne(original, newVals);
	// } else {
	// 	await userColl.insertOne({user: username, idLast: 0})
	// 	nextID = 0;
	// }
	
	return nextID;
}

module.exports = { getNextID }


