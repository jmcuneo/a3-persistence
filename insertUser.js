require('dotenv').config();
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);
client.connect().then(async () => {
    const db = client.db("4241database");
    const usersCollection = db.collection('users');

    const hashedPassword = await bcrypt.hash('redlight123', 10);
    await usersCollection.insertOne({ username: 'hanzalah', password: hashedPassword });

    console.log('User inserted');
    client.close();
});
