const Shift = require("../models/shiftSchema");
const User = require("../models/userSchema");

const addShift = async (req, res) => {
	const username = req.user.username;
	const userResults = await User.find({}).where("user").equals(username);
	res.json(userResults);
	
}

const getAllShifts = async (req, res) => {
	const shifts = await Shift.find({});
	res.status(200).json(shifts); 
}

module.exports = { addShift, getAllShifts };