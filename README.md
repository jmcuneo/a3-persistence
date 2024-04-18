**Name: Ronak Wani**  
**Email: rvwani@wpi.edu**  
**CS 4241: WebWare (Assignment 3)**
**Website: Recipe System**

Vercel Link:

The website allows the users to create accounts and share their recipes with the world. I have created a registration and login system
that authenticates the user using **bcrypt** npm package. If the user enters invalid credentials I redirect him to error.html, I also
tried implementing jsonwebtokens for technical achievement but was unable to accomplish it.

I have created two data models: userModel and recipeModel. The user model stores the user details with bcrypted password in the MongoDB
database. The recipeModel stores the recipes. The website requires the user to provide recipe name, ingredients,
description, taste, dietary restrictions.

Challenges Faced:

The major challenge faced by me was the implementation of JWT, I gave a strong attempt on acomplishing this and have left the code
in the repo for the grader to take a look at it and provide some partial credit. I also tried GitHub OAuth but for some reason,
I was unable to implement passport.js. We were not allowed to use Facebook, Google, or Twitter OAuth so did not play around with it.

I chose to use Tailwind CSS because of its popularity in current market. I had prior experience of using Bootstrap and wanted
to try a new framework hence I chose to use Tailwind CSS over other frameworks.
The utility-first approach of Tailwind CSS gave me more control and flexibility over customization of user interfaces, 
compared to the more opinionated nature of frameworks like Bootstrap.

I just added a display:none style tag to the tailwind css for hiding the "Confirm" button from the user
which is made visible only when the user sends an update (PUT) request.

List of NPM packages:
- **bcrypt**: Library for hashing passwords securely before storing them in the database.  
- **express**: Web application framework for Node.js, used for building the server-side of the application. 
- **express-api-response**: A middleware for Express that helps with formatting API responses. 
- **express-async-handler**: A middleware for Express that helps with handling asynchronous errors. 
- **express-respond**: A middleware for Express that provides a consistent way to respond to API requests. 
- **express-session**: A middleware for Express that provides session management functionality. 
- **jsonwebtoken**: A library for generating and verifying JSON Web Tokens (JWT) for authentication and authorization. 
- **mongodb**: The official MongoDB driver for Node.js, used for interacting with a MongoDB database. 
- **mongoose**: An Object Document Mapping (ODM) library for MongoDB and Node.js, providing a higher-level abstraction for working with the database. 
- **tailwindcss**: A utility-first CSS framework for rapidly building custom user interfaces. 
- **nodemon**: A tool that automatically restarts the Node.js application when file changes are detected, useful for development.


## Technical Achievements:

Tech Achievement 1: I created user registration and login. The passwords are encrypted with the help of bcrypt npm
package. I tried to implement json web tokens, but I was not completely successful. Prof. Joshua Cuneo told me that 
bcrypt is also a technical achievement.

Tech Achievement 2: Hosted the application on Vercel rather than using glitch.
Some pros of using vercel over glitch are as follows:
- Vercel is faster than glitch in loading webpages
- Vercel has a free tier
- Vercel makes dyanmic changes on the deployed website based on the latest commits made on main branch  

Some cons of using vercel over glitch are as follows:
- Vercel is not as beginner-friendly as glitch
- Vercel has a learning curve

## Design/Evaluation Achievements
Design Achievement 1:   

Design Achievement 2: