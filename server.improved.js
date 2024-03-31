const express = require('express');
const { MongoClient, ObjectId } = require("mongodb")
const app = express();
const port = 3000;
const entries = [{
    name: "Bryon Tom",
    bodyWeight: 132,
    squat: 297,
    benchPress: 171,
    deadLift: 357,
    total: 825
}];

app.use(express.static('public'));
app.use(express.static('views'));

const middleware_post = (req, res, next) => {
    let dataString = '';

    req.on('data', function (data) {
        dataString += data;
    });

    req.on('end', function () {
        const json = JSON.parse(dataString);
        json.total = Number(json.squat) + Number(json.benchPress) + Number(json.deadLift);

        entries.push(json);

        // add a 'json' field to our request object
        // this field will be available in any additional
        // routes or middleware.
        req.json = JSON.stringify(entries);

        // advance to next middleware or route
        next();
    });
};

app.post('/submit', middleware_post, (req, res) => {
    //entries.push( req.body )
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(JSON.stringify(entries));
});

app.get('/entries', (req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(entries));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
