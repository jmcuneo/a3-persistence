const express = require('express');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static("public") )


// In-memory user store for demonstration
const users = [
    { "user": "user123", "password": "password123" }

];


// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user_obj = users.find(user => user.user === username);

  // Check if user exists and password matches
  if (user_obj && user_obj["password"] === password) {
    // Login successful
    res.json({ success: true, message: 'Login Successful' });
  } else if (user_obj && user_obj["password"] !== password){
    res.status(401).json({ success: false, message: 'Wrong Password' });
  } else if (!user_obj){
    users.push({ "user": username, "password": password })
    res.status(401).json({ success: false, message: 'New account created, login again' });
  } 
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
