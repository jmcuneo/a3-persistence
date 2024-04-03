const express = require('express');

const router = express.Router();
const dir = 'public/';


let appdata = [
  { name: 'John', id: '1', addedDate: new Date(), count: 1 },
  { name: 'Paul', id: '2', addedDate: new Date(), count: 1 },
  { name: 'George', id: '3', addedDate: new Date(), count: 1 },
  { name: 'Paul', id: '4', addedDate: new Date(), count: 2 },
];

router.get('/getdata', (req, res) => {
  res.json(appdata);
});

router.post('/delete', (req, res) => {
  const { row } = req.body;
  const index = appdata.findIndex(x => x.id === row.id);
  if (index !== -1) {
    appdata.splice(index, 1);
  }
  res.json({ success: index !== -1 });
});

router.post('/edit', (req, res) => {
  const { row } = req.body;
  const index = appdata.findIndex(x => x.id === row.id);
  if (index !== -1) {
    appdata[index].name = row.newName;
  }
  res.json({ success: index !== -1 });
});

router.post('/add', (req, res) => {
  const {name} = req.body;

  let data = {
    name: name,
    id: Math.random().toString(36).substring(2, 11),
    addedDate: new Date()
  };

  data.id = Math.random().toString(36).substring(2, 11);
  data.addedDate = new Date();
  let count = 0;
  for (let i = 0; i < appdata.length; i++) {
    if (appdata[i].name && data.name && appdata[i].name.toLowerCase() === data.name.toLowerCase()) {
      count++;
    }
  }
  count++;
  data.count = count;
  appdata.push(data);
  res.json(data);
});

module.exports = router;