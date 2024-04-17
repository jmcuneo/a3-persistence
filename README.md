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
- bcrypt: Library for hashing passwords securely before storing them in the database.  
- express: Web application framework for Node.js, used for building the server-side of the application. 
- express-api-response: A middleware for Express that helps with formatting API responses. 
- express-async-handler: A middleware for Express that helps with handling asynchronous errors. 
- express-respond: A middleware for Express that provides a consistent way to respond to API requests. 
- express-session: A middleware for Express that provides session management functionality. 
- jsonwebtoken: A library for generating and verifying JSON Web Tokens (JWT) for authentication and authorization. 
- mongodb: The official MongoDB driver for Node.js, used for interacting with a MongoDB database. 
- mongoose: An Object Document Mapping (ODM) library for MongoDB and Node.js, providing a higher-level abstraction for working with the database. 
- tailwindcss: A utility-first CSS framework for rapidly building custom user interfaces. 
- nodemon: A tool that automatically restarts the Node.js application when file changes are detected, useful for development.


Technical Achievements
Tech Achievement 1: I used OAuth authentication via the GitHub strategy
Design/Evaluation Achievements
Design Achievement 1: I followed the following tips from the W3C Web Accessibility Initiative...
=======
Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Check out the [CS 4241 Guides](https://github.com/jmcuneo/cs4241-guides) for help with the technologies discussed in this assignment.

This assignnment continues where we left off, extending it to use the most popular Node.js server framework (express), 
a database (mongodb), and a CSS application framework / template of your choice (Boostrap, Material Design, Semantic UI, Pure etc.)

Baseline Requirements
---

Your application is required to implement the following functionalities:

- (15 points) a `Server`, created using Express (no alternatives will be accepted for this assignment)
- (10 points) a `Results` functionality which shows all data associated with a logged in user (except passwords)
- (15 points) a `Form/Entry` functionality which allows users to add, modify, and delete data items (must be all three!) associated with their user name / account.
- Persistent data storage in between server sessions using [mongodb](https://www.mongodb.com/cloud/atlas) (you *must* use mongodb for this assignment). You can use either the [official mongodb node.js library](https://www.npmjs.com/package/mongodb) or use the [Mongoose library](https://www.npmjs.com/package/mongoose), which enables you to define formal schemas for your database. Please be aware that the course staff cannot provide in-depth support for use of Mongoose.  (15 pts.)
- (10 points) Use of a [CSS framework or template](https://github.com/troxler/awesome-css-frameworks). This should do the bulk of your styling/CSS for you and be appropriate to your application. 
For example, don't use [NES.css](https://nostalgic-css.github.io/NES.css/) (which is awesome!) unless you're creating a game or some type of retro 80s site.

Your application is required to demonstrate the use of the following concepts:  

HTML:  
- (5 points) HTML input tags and form fields of various flavors (`<textarea>`, `<input>`, checkboxes, radio buttons, etc.)
- HTML that can display all data *for a particular authenticated user*. Note that this is different from the last assignnment, which required the display of all data in memory on the server.

Note that it might make sense to have two pages for this assignment, one that handles login / authentication and one that contains the rest of your application.
For example, when visiting the home page for the assignment, users could be presented with a login form. After submitting the login form, if the login is 
successful, they are taken to the main application. If they fail, they are sent back to the login to try again. For this assignment, it is acceptable to simply create 
new user accounts upon login if none exist; however, you must alert your users to this fact.  

CSS:  
- CSS styling should primarily be provided by your chosen template/framework. 
Oftentimes a great deal of care has been put into designing CSS templates; 
don't override their stylesheets unless you are extremely confident in your graphic design capabilities. 
The idea is to use CSS templates that give you a professional looking design aesthetic without requiring you to be a graphic designer yourself.

JavaScript:  
- At minimum, a small amount of front-end JavaScript to get / fetch data from the server. 
See the [previous assignment](https://github.com/cs-4241-23/shortstack) for reference.

Node.js:  
- A server using Express and a persistent database (mongodb).

General:  
- (10 points) Your site should achieve at least 90% on the `Performance`, `Best Practices`, `Accessibility`, and `SEO` tests 
using Google [Lighthouse](https://developers.google.com/web/tools/lighthouse) (don't worry about the PWA test, and don't worry about scores for mobile devices).
Test early and often so that fixing problems doesn't lead to suffering at the end of the assignment. 

Deliverables
---

Do the following to complete this assignment:

1. Implement your project with the above requirements. I'd begin by converting your A2 assignment. First, change the server to use express. Then, modify the server to use mongodb instead of storing data locally. Last but not least, implement user accounts and login. User accounts and login is often the hardest part of this assignment, so budget your time accordingly.
2. If you developed your project locally, deploy your project to Glitch (unless completing the alternative server technical acheivement described below), and fill in the appropriate fields in your package.json file.
3. Test your project to make sure that when someone goes to your main page on Glitch (or an alternative server), it displays correctly.
4. Ensure that your project has the proper naming scheme `a3-FirstnameLastname` so we can find it.
5. Fork this repository and modify the README to the specifications below.
6. Create and submit a Pull Request to the original repo. Name the pull request using the following template: `a3-FirstnameLastname`.

Acheivements
---

Below are suggested technical and design achievements. You can use these to help boost your grade up to an A and customize the 
assignment to your personal interests, for a maximum twenty additional points and a maximum grade of a 100%. 
These are recommended acheivements, but feel free to create/implement your own... just make sure you thoroughly describe what you did in your README, 
why it was challenging, and how many points you think the achievement should be worth. 
ALL ACHIEVEMENTS MUST BE DESCRIBED IN YOUR README IN ORDER TO GET CREDIT FOR THEM.

*Technical*
- (10 points) Implement OAuth authentication, perhaps with a library like [passport.js](http://www.passportjs.org/). 
*You must either use Github authenticaion or provide a username/password to access a dummy account*. 
Course staff cannot be expected, for example, to have a personal Facebook, Google, or Twitter account to use when grading this assignment. 
Please contact the course staff if you have any questions about this. THIS IS THE HARDEST ACHEIVEMENT OFFERED IN WEBWARE. You have been warned!  
- (5 points) Instead of Glitch, host your site on a different service. Find a service that is reputable and has a free tier. Post your findings on Slack in the #assignment3 channel. DO NOT feel compelled to purchase a paid tier from any service, although if you already have one, you are welcome to use it. Make sure to describe this a bit in your README. What was better about using the service you chose as compared to Glitch? What (if anything) was worse? 
- (5 points) Get 100% (not 98%, not 99%, but 100%) in all four lighthouse tests required for this assignment.  

*Design/UX*
- (10 points) Make your site accessible using the [resources and hints available from the W3C](https://www.w3.org/WAI/), Implement/follow twelve tips from their [tips for writing](https://www.w3.org/WAI/tips/writing/), [tips for designing](https://www.w3.org/WAI/tips/designing/), and [tips for development](https://www.w3.org/WAI/tips/developing/). *Note that all twelve must require active work on your part*. 
For example, even though your page will most likely not have a captcha, you don't get this as one of your twelve tips to follow because you're effectively 
getting it "for free" without having to actively change anything about your site. 
Contact the course staff if you have any questions about what qualifies and doesn't qualify in this regard. 
List each tip that you followed and describe what you did to follow it in your site.
- (5 points) Describe how your site uses the CRAP principles in the Non-Designer's Design Book readings. 
Which element received the most emphasis (contrast) on each page? 
How did you use proximity to organize the visual information on your page? 
What design elements (colors, fonts, layouts, etc.) did you use repeatedly throughout your site? 
How did you use alignment to organize information and/or increase contrast for particular elements. 
Write a paragraph of at least 125 words *for each of four principles* (four paragraphs, 500 words in total). 


FAQ
---
**Q: Am I required modify my A2 submission for this assignment?**

No. If you want to start fresh for A3, you are welcome to do so. The option to start with A2 is simply there as a convenience for you.

**Q: Which CSS framework should I use? How do I use it?**

This is for you to figure out. While we do require Express and MongoDB for this assignment, we do not require a specific CSS framework, so we are not going to be discussing a specific one. You will be responsible for choosing a CSS framework and learning how to use it.

**Q: How do I keep my .env file out of my git repo?**

Create a .gitignore file on your local machine and list your .env file in it. Note that while your .env file should NOT appear in your repo, you will still want to add it to your Glitch project so that your website runs successfully.

**Q: I'm confused about how user accounts work for this assignment.**

For the base requirements (discounting the achievements), it should follow this logic:

1. If the user logs in and the account does not exist, create the account and inform the user the account has been created.
2. If the user logs in and the account exists but the password is incorrect, inform the user.
3. If the user logs in, the account exists, and the password is correct, then take the user to the page that shows the data specific to the user.

Note that implementing some of the technical achievements may override this requirement, which is fine.

**Q: I'm getting a syntax error when trying to connect to MongoDB using the code in the tutorial.**

Your version of Node may be outdated. Check out [this link](https://stackoverflow.com/questions/77749884/session-options-session-syntaxerror-unexpected-token-mongoose-give-a) for more information.

**Q: Do I have to handle multiple user accounts?**

No. You only need one dummy account UNLESS you are doing the GitHub login technical achievement. Make sure you mention in your README how the user should log in!

**Q: If we use OAuth for logging in, do we still need the same pattern of behavior from the website when logging in (as described above)?**

Yes, insofar as the logged in user should still be taken to a page with the user's data, the login should fail for the incorrect password, and a new account should be created if the username is unrecognized.

Note that if you are doing OAuth, this last part might be difficult (especially if you are doing GitHub authentication). If that's the case, then the user should be taken to a page where they can create an account for your site.

**Q: Does "HTML input tags and form fields of various flavors" mean that we need to use multiple different kinds of inputs, or does it mean that we just need to use some form of input?**

You should have at least two different input types for this assignment. The purpose is to show your understanding beyond the simple `input` type you saw in A2.

**Q: Am I allowed to use other libraries/frameworks/etc. in this assignment?**

Yes, so long as those are IN ADDITION TO Express, MongoDB, and a CSS framework of your choice. Describe in your README any additional libraries or frameworks you used for this assignment. Also remember that the staff might not be familiar with these, so we may be unable to help you if you run into technical problems.


Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

## Your Web Application Title

your glitch (or alternative server) link e.g. http://a3-joshua-cuneo.glitch.me

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of the application
- challenges you faced in realizing the application
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored
- a list of Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function, please add a little more detail about what it does.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...
