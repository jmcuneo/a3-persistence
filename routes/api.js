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
  count: Number
});
const Data = mongoose.model('Data', dataSchema);

//create a user model
const userSchema = new Schema({
  username: String,
  password: String
});
const User = mongoose.model('User', userSchema);

const app = express();
const session = require('express-session');

app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if your app is on https
}));

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username, password });
      await user.save();
      req.session.userId = user._id;
      res.json({ success: true, message: 'User created successfully' });
    } else {
      if (user.password === password) {
        req.session.userId = user._id;
        res.json({ success: true, message: 'Login successful' });
      } else {
        res.json({ success: false, message: 'Invalid password' });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

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
    const result = await Data.deleteOne({ _id: row._id });
    res.json({ success: result.deletedCount > 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete data' });
  }
});
router.post('/edit', async (req, res) => {
  const { row } = req.body;
  try {
    const result = await Data.updateOne({ _id: row._id }, { name: row.newName });
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