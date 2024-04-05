
const express = require('express');
const app = express();
const port = 3000;
const { MongoClient, ObjectId } = require('mongodb');

//Add to mongoDB later
const appdata = [
]


// mongodb+srv://ethanmoynihan1:<password>@cluster0.eizuerf.mongodb.net/
// Connection URL
const url = 'mongodb+srv://ethanmoynihan1:LfT1zHIyd3SSZwGj@cluster0.eizuerf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


// user db
const dbName = 'a3-em';
const dbUser = 'userDatabase';
const orderStorage = "orderStorage";

const client = new MongoClient(url);


app.use(express.static('public'))
app.get('/', (request, response) =>{

    response.sendFile("public/home.html" )
}
)

// need to return data here
app.post('/edit', (request, response) => {
  let dataString = ""
  //Concats data as it is recieved
  request.on( "data", function( data ) {
      dataString += data 
  })
  //data reaches its end
  request.on( "end", async function() {
    console.log( JSON.parse( dataString ) );
    let info = JSON.parse(dataString);

    try{
      await client.connect();
      console.log('Connected successfully to the server');

      const db = client.db(dbName);
      const editstorage =  db.collection(orderStorage);
      let calccost = (parseFloat(info.breakfast) *10.5 + parseFloat(info.coffee) * 2.5);
      let id = new ObjectId(info._id)
      console.log(id)
      const filter = { _id:  id};
      const update = { $set: {yourname: info.yourname, breakfast: info.breakfast, coffee:info.coffee, cost:calccost} };
      
      try{
        
        await editstorage.updateOne(filter, update);
      
        response.status(200).json({ message: 'Data updated', data:calccost});
        console.log(info);
      }
      catch(err){
        console.error('Error finding data: '+ err);
        response.status(404).json({ message: 'Failed finding data' });
        
      }
  }
  catch(err){

    console.error('Failed to connect to the database: ' + err);
    response.status(500).json({ message: 'Failed to connect to the database' });
      
  }
  finally{

    client.close();
  }   
  })
})

app.post('/delete', (request, response) => {
  let dataString = ""
  //Concats data as it is recieved
  request.on( "data", function( data ) {
      dataString += data 
  })
  //data reaches its end
  request.on( "end", async function() {
    console.log( JSON.parse( dataString ) );
    let info = JSON.parse(dataString);

    try{
      await client.connect();
      console.log('Connected successfully to the server');

      const db = client.db(dbName);
      const removestorage =  db.collection(orderStorage);
      let id = new ObjectId(info._id)
      console.log(id)
      const filter = { _id:  id};
      
      try{
        
        await removestorage.deleteOne(filter);
      
        response.status(200).json({ message: 'Data deleted'});
        console.log(info);
      }
      catch(err){
        console.error('Error finding data: '+ err);
        response.status(404).json({ message: 'Failed finding data' });
        
      }
  }
  catch(err){

    console.error('Failed to connect to the database: ' + err);
    response.status(500).json({ message: 'Failed to connect to the database' });
      
  }
  finally{

    client.close();
  }   
  })
})

// need to return data here
app.post('/data', (request, response) => {
  let dataString = ""
  //Concats data as it is recieved
  request.on( "data", function( data ) {
      dataString += data 
  })
  //data reaches its end
  request.on( "end", async function() {
    console.log( JSON.parse( dataString ) );
    let info = JSON.parse(dataString);

    try{
      await client.connect();
      console.log('Connected successfully to the server');

      const db = client.db(dbName);
      const storage =  db.collection(orderStorage);
     
      try{
        console.log(info);
        let mem = await storage.find({username : info.username}).toArray();
        //let ret = mem.toArray();
        
  
        console.log('Data found!');
        response.status(200).json({ message: 'Data returned successfully' , data: JSON.stringify(mem)});
      }
      catch {
        console.error('Error finding data:');
        response.status(500).json({ message: 'Failed finding user' });
        
      }
  }
  catch{
    console.error('Failed to connect to the database:');
    response.status(500).json({ message: 'Failed to connect to the database' });
      
  }
  finally{

    client.close();
    console.log( JSON.parse( dataString ) );
  }   
  })
})

app.post('/submit', (request, response)=>{
  let dataString = ""
  //Concats data as it is recieved
  request.on( "data", function( data ) {
      dataString += data 
  })
  //data reaches its end
  request.on( "end", async function() {
    console.log( JSON.parse( dataString ) );
    let precalc = JSON.parse(dataString);
    precalc["cost"] = parseFloat(precalc["breakfast"]) *10.5 + parseFloat(precalc["coffee"]) * 2.5;
    appdata.push(precalc)
    try{
      await client.connect();
      console.log('Connected successfully to the server');

      const db = client.db(dbName);
      const storage =  db.collection(orderStorage);
     
      try{
        await storage.insertOne(precalc);
          
        console.log('Order completed successfully ');
        response.status(200).json({ message: 'Order completed' });
      }
      catch {
        console.error('Error inserting user:');
        response.status(500).json({ message: 'Failed to insert' });
        
      }
  }
  catch{
    console.error('Failed to connect to the database:');
    response.status(500).json({ message: 'Failed to connect to the database' });
      
  }
  finally{

    client.close();
    console.log( JSON.parse( dataString ) );
  }
    console.log(precalc);    
  })
})

app.post('/login', (request, response) =>{
  let dataString = ""
  //Concats data as it is recieved
  request.on( "data", function( data ) {
      dataString += data 
  })
  //data reaches its end
  request.on( "end", async function() {
    console.log( JSON.parse( dataString ) );
    let userInfo = JSON.parse(dataString);
    if((userInfo['password'].length === 0 ) || (userInfo['username'].length === 0 )){
      response.status(500).json({"message": "Username or password field empty" });
      return;
    }
    try{
        await client.connect();
        console.log('Connected successfully to the server');
  
        const db = client.db(dbName);
        const users =  db.collection(dbUser);
  
        const userName = await users.findOne({username: userInfo['username']});
        console.log(userName);
        if(userName === null){
          response.status(404).json({ message: 'account does not exist' });
        }
        else{
          
          if(userName.password === userInfo['password']){
          response.status(200).json({ message: 'Logged in', username: userInfo['username']});
        }else{
          response.status(403).json({ message: 'Incorrect password'});
        }
        };
      
    }
    catch{
      console.error('Failed to connect to the database:');
      response.status(500).json({ message: 'Failed to connect to the database' });
    }
    finally{

      client.close();
      console.log( JSON.parse( dataString ) );
    }


  })// request end
})

app.post('/createAccount', (request, response) =>{
  let dataString = ""
  //Concats data as it is recieved
  request.on( "data", function( data ) {
      dataString += data 
  })
  //data reaches its end
  request.on( "end", async function() {
    let userInfo = JSON.parse(dataString);
    if((userInfo['password'].length === 0 ) || (userInfo['username'].length === 0 )){
      response.status(500).json({"message": "Username or password field empty" });
      return;
    }
    try{
        await client.connect();
        console.log('Connected successfully to the server');
  
        const db = client.db(dbName);
        const users =  db.collection(dbUser);
  
        const userName = await users.findOne({username: userInfo['username']});
        console.log(userName);
        if(userName === null){
          try{
          await users.insertOne({ username: userInfo['username'], password: userInfo['password'] })
            
          console.log('User inserted successfully');
          response.status(200).json({ message: 'User created successfully' });
        }
        catch {
          console.error('Error inserting user:');
          response.status(500).json({ message: 'Failed to insert' });
          
        }
        }
        else{
          response.status(401).json({ message: 'Already exists' });
        };
      
    }
    catch{
      console.error('Failed to connect to the database:');
      response.status(500).json({ message: 'Failed to connect to the database' });
        
    }
    finally{

      client.close();
      console.log( JSON.parse( dataString ) );
    }

    
  })
})


app.listen( process.env.PORT || port )
