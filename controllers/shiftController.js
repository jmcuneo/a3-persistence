const Shift = require("../models/shiftSchema");

const getAllShifts = async (req, res) => {
	const shifts = await Shift.find({});
	res.status(200).json(shifts); 
}

module.exports = { getAllShifts };