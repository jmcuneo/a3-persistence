Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template

## Course Manager

https://a3-joelhokkanen.glitch.me

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

The goal of this application is to store a list of courses and display that data for a user to view or edit. Each course entry can also include the professor teaching it, the grade received, and additional notes. For authentication, I implemented the method that seemed most straightforward to me: the server checks the database for an existing user with the entered username and  compares the password to the database if it exists or creates a new user if not. I found there to be a lot of challenges in this assignment, but the biggest one was getting the server to function properly. I spent a large portion of my time trying to debug the server (especially the 'logout' feature), but connecting to and implementing the MongoDB database was not too hard. I used the Pure CSS framework because it was relatively simple and lightweight and I was interested in how it is good for making responsive design. I wrote some minor CSS additions and borrowed some from the examples on the Pure CSS site. Mostly, I changed button colors and the specifics of the header. The middleware used by the server includes express.json, express.urlencoded, and two simple custom functions: one that verifies that the server is connected to MongoDB and one that verifies that the user is logged in. 

Technical Achievements
Tech Achievement 1: I got 100% on each of the Google Lighthouse tests for my site. The main difficulties I had were SEO issues with robots.txt and getting contrast levels to be acceptable. 
