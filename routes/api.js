const express = require('express');
require('dotenv').config();
const router = express.Router();
const dir = 'public/';


// let appdata = [
//   { name: 'John', id: '1', addedDate: new Date(), count: 1 },
//   { name: 'Paul', id: '2', addedDate: new Date(), count: 1 },
//   { name: 'George', id: '3', addedDate: new Date(), count: 1 },
//   { name: 'Paul', id: '4', addedDate: new Date(), count: 2 },
// ];

//implement mongoose with mongodb instead of appdata
const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;
const dataSchema = new Schema({
  name: String,
  id: String,
  addedDate: Date,
  count: Number
});
const Data = mongoose.model('Data', dataSchema);

router.get('/getdata', async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

router.post('/delete', async (req, res) => {
  const { row } = req.body;
  try {
    const result = await Data.deleteOne({ id: row.id });
    res.json({ success: result.deletedCount > 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete data' });
  }
});
router.post('/edit', async (req, res) => {
  const { row } = req.body;
  try {
    const result = await Data.updateOne({ id: row.id }, { name: row.newName });
    res.json({ success: result.nModified > 0 });
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
      id: Math.random().toString(36).substring(2, 11),
      addedDate: new Date(),
      count: count + 1
    });
    await data.save();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add data' });
  }
});


module.exports = router;