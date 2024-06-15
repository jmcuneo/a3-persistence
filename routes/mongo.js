const mongo = require("mongodb").MongoClient;
const uri = process.env.MONGO;

mongo.connect(uri, function(err, db) {
  if (err) throw err;
  const dbo = db.db("webware");
  dbo.collection("shifts").find({}).toArray(function(err, result) {
	if (err) throw err;
	console.log(result);
	db.close();
  })
})
