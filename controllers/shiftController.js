const Shift = require("../models/shiftSchema");

const getAllShifts = async (req, res) => {
	try {
		const shift = Shift.find();
		res.json(shift);
	} catch (error) {
		res.status(500).json({error: "an error occured"});
	}
}

module.exports = getAllShifts;