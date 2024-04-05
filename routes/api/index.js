const express = require('express');
require('dotenv').config();
const router = express.Router();
const dir = 'public/';


const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;
const dataSchema = new Schema({
  name: String,
  id: String,
  addedDate: Date,
  count: Number,
  userId: String
});
const Data = mongoose.model('Data', dataSchema);




//get all data associated with userid
router.get('/getdata', async (req, res) => {
  try {
    const data = await Data.find({ userId: req.session.userId });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

router.post('/delete', async (req, res) => {
  const { row } = req.body;
  try {
    const result = await Data.deleteOne({ _id: row._id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete data' });
  }
});
router.post('/edit', async (req, res) => {
  const { row } = req.body;
  try {
    const result = await Data.updateOne({ _id: row._id }, { name: row.newName });
    res.json({ success: true});
  } catch (error) {
    res.status(500).json({ error: 'Failed to edit data' });
  }
});

router.post('/add', async (req, res) => {
  const { name } = req.body;
  try {
    const count = await Data.countDocuments({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    const data = new Data({
      name: name,
      addedDate: new Date(),
      count: count + 1,
      userId: req.session.userId
    });
    await data.save();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add data' });
  }
});


module.exports = router;