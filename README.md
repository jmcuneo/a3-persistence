Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Check out the [CS 4241 Guides](https://github.com/jmcuneo/cs4241-guides) for help with the technologies discussed in this assignment.

This assignnment continues where we left off, extending it to use the most popular Node.js server framework (express), 
a database (mongodb), and a CSS application framework / template of your choice (Boostrap, Material Design, Semantic UI, Pure etc.)

Baseline Requirements
---

Your application is required to implement the following functionalities:

- a `Server`, created using Express (no alternatives will be accepted for this assignment)
- a `Results` functionality which shows all data associated with a logged in user (except passwords)
- a `Form/Entry` functionality which allows users to add, modify, and delete data items (must be all three!) associated with their user name / account. 
- Persistent data storage in between server sessions using [mongodb](https://www.mongodb.com/cloud/atlas) (you *must* use mongodb for this assignment). You can use either the [official mongodb node.js library](https://www.npmjs.com/package/mongodb) or use the [Mongoose library](https://www.npmjs.com/package/mongoose), which enables you to define formal schemas for your database. Please be aware that the course staff cannot provide in-depth support for use of Mongoose.  
- Use of a [CSS framework or template](https://github.com/troxler/awesome-css-frameworks). 
This should do the bulk of your styling/CSS for you and be appropriate to your application. 
For example, don't use [NES.css](https://nostalgic-css.github.io/NES.css/) (which is awesome!) unless you're creating a game or some type of retro 80s site.

Your application is required to demonstrate the use of the following concepts:  

HTML:  
- HTML input tags and form fields of various flavors (`<textarea>`, `<input>`, checkboxes, radio buttons etc.)
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
- Your site should achieve at least 90% on the `Performance`, `Best Practices`, `Accessibility`, and `SEO` tests 
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

Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

## Your Web Application Title

https://a3-andrewnguyen.onrender.com/

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of the application
- challenges you faced in realizing the application
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored
- the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please 
add a little more detail about what it does.

My  application is a continuation of my previous assignment: The Cars Database. The goal of my application was to connect my application from the client to the server then to the mongo database where the client can sender data to the server which sends to the database to be stored. 
I faced challenges in adapting to Express specifically in app.use() as the middleware functions were new to me. I also faced challenges in the directories as my middleware functions had been confused with files being sent to the server.
I chose to use an authentication system similar to when2meet where the user inputs a username and password to access the database and if they have an account with the username it'll check the password and if not the user is created. I chose this because it was the easiest to implement.
I used Express to create a server and MongoDB to store data. My middleware packages would send the data from the client to the server and then to the database. The data would then be added, modified or deleted and then sent back to the client to be displayed. 
I used the Bootstrap CSS framework because it is easy to use and has a lot of pre-made components. 
I mostly used application-level middleware. I used the following Express middleware packages:
- app.use(express.json()) - This middleware function parses incoming requests with JSON payloads.
- app.use(express.static( __dirname + '/public')) - This middleware function serves static files so that the other functions know where to look in the directory.
- app.get() - This function is used to send data to the client. I used this to send files and data to the client.
- app.post() - This function is used to receive data from the client. I used this in my server code to receive data from the client, check if the inputs are valid and then sent to the database.
- app.delete() - This function is used to delete data from the database. I used in my server code this to look for if the ID exists and then delete data from the database.
- app.put() - This function is used to modify data in the database. I used this in my server code to look for the correct ID then modify data in the database.

![alt text](https://github.com/atnguyen01/a3-AndrewNguyen/blob/main/img/Screenshot%202024-04-04%20192417.png)


## Technical Achievements
- **Tech Achievement 1**: I used Render to create my webpage rather than Glitch. I found that Render was easier to use than Glitch as it was more user-friendly and had a better interface. I also found that Render was better than Glitch in terms of loading the page and updating the page. Here is the message I sent earlier in the Slack:
  Pros:
  - Free 
  - Can use automatic redeployment for a new version on Github 
  - Can revert to a previous commits 
  - No extra setup in your project directory 
  - can insert env variables by inserting them when creating the page 
  - Different options for deployment (I used web service so that the site can be ready and running immediately when someone visits the site)
  Cons:
  - Deployment for free version is slow (I had to cancel and restart the automatic deployment to get it to work)
  - Loading the page itself sometimes is slow as well

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative.
  - Tip 1: Associate a label with every form control. I added labels for all my form fields.
  - Tip 2: Help users avoid and correct mistakes by including example inputs through text.
  - Tip 3: Don't use color alone to convey information. I used an alert to convey login is incorrect.
  - Tip 4: Ensure that interactive elements are easy to identify. I used a buttons, text boxes and dropdowns that changes the mouse to signify interactive.
  - Tip 5: Provide informative, unique page titles. I used the title "CS4241 Assignment 3 Car Database • Andrew Nguyen" to signify the main page and "CS4241 Assignment 3 Car Database Login • Andrew Nguyen" to signify the login page.
  - Tip 6: Use headings to convey meaning and structure. I used h1 for the title of the page and h2 for the login form. I used headers for my forms to signify what the form is for.
  - Tip 7: Provide clear instructions. I used a placeholder for the username and password fields to signify what the user should input. I used an alert to signify that the login was incorrect.
  - Tip 8: Keep content clear and concise. I used a simple login form with only two fields and a submit button. And made simple instructions.
  - Tip 9: Use mark-up to convey meaning through structure. I used a form tag to signify that the fields are for inputting data and use div and grid for page structure.
  - Tip 10: Provide easily identifiable feedback. I used an alert to signify that the login was incorrect.
  - Tip 11: Use headings and spacing to group related content. I used headers for my forms to signify what the form is for and separate spaces.
  - Tip 12: Reflect the reading order in the code order. I used the order of the code to signify the order of the page. The title is first, then the login form, then the footer. Same with the main page having title, forms, and table.
- **Design Achievement 2**: I used the CRAP principles in my design. 
