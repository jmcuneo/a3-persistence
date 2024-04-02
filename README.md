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

# Recipe Cookbook

Link: https://a3-EllysGorodisch.onrender.com
*Note: May take long amount of time to load*

- Goal
    - Add, remove, and modify recipes in your cookbook
    - Enter the recipe name, prep time, cook time, and meal that the recipe is for
    - The total time is calculated automatically 
- Challenges
    - I had significant difficulties near the end of implementing OAuth GitHub due to my deserializeUser function being async, once I solved that things went smoothly
- Authentication Strategy
    - I used OAuth GitHub authentitcation because it was the only OAuth implementation I didn't need to make a dummy account for
    - I used OAuth authentication for the technical achievement
- CSS Framework
    - I used Pico CSS Sand because it was minimalist and had an intuitive designing process for a color scheme I liked
    - Modifications
        - I used CSS for index.html to center the button in the middle of the screen and change the font size and focus color of the login button
        - I used CSS for recipes.html to organize the page using Flexbox, add margins, shrink the size of the inputs, and change the focus color of the buttons
- Express Middleware
    1. express.static: Lets the server access files from the 'public' folder
    2. Logger: Prints the URL of all requests to the server
    3. express.json: Automatically parses JSON input
    4. Cookie Session: Initialized a new cookie session
    5. Regenerate Function: I was getting an error related to a missing function related to passport.session, found this middleware online that fixes it
    6. passport.initialize: Initializes passport.js authentication
    7. passport.session: Initializes the session authentication strategy for passport.js
    8. Collection Checker: Checks if the MongoDB collection was successfully accessed

## Technical Achievements
- **Implement OAuth Authentication**: I used OAuth authentication via the GitHub strategy for logging in to the site. User accounts are stored in MongoDB.
- **Alternate Hosting**: I used Render to host my site for this project, recommended by Milo Jacobs in the Slack. It was very convenient that it updates automatically from GitHub, but I agree with him that it is very slow to build and load. The setup was quite simple, but it is lacking features like an editor and preview window from Glitch.
- **Lighthouse Tests**: I have a 100% in all four Lighthouse tests for both pages in my site

## Design/Evaluation Achievements
### W3C Web Accessibility Tips
**Writing Tips**:
- *Provide informative, unique page titles*: Changed titles for index.html and repices.html from "CS4241 Assignment 3" to "Assignment 3" and "Recipes | Assignment 3" respectively
- *Use headings to convey meaning and structure*: Added clear headings and subheadings so that users are clear about what each section entails
- *Provide clear instructions*: Added instruction text at head of page

**Designing Tips**:
- *Provide sufficient contrast between foreground and background*: Used a dark mode color scheme with high contrast between the text and button colors and the background (confirmed using the Chrome DevTools for rendering page for people with different visual deficiencies)
- *Ensure that interactive elements are easy to identify*: Changed CSS for buttons that are focused to be more obvious
- *Ensure that form elements include clearly associated labels*: Added placeholder text for each input box so that users know what to enter into each box
- *Provide easily identifiable feedback*: Added alert for when user tries to remove or modify a recipe that does not exist
- *Use headings and spacing to group related content*: Grouped the headers, inputs, and buttons for each user action into visually distinct sections

**Development Tips**:
- *Associate a label with every form control*: Added placeholder text for each input so that users would know what to enter into each box
- *Identify page language and language changes*: Added `<html lang="en">` to the start of index.html and recipes.html
- *Use mark-up to convey meaning and structure*: Added WAI-ARIA roles and labels to main regions of the page
- *Help users avoid and correct mistakes*: Added alert for when all fields are not filled when a form is submitted

### CRAP Principles
**Contrast**: 

**Repetition**: I used repetition heavily while creating my site. I used the same color scheme and font throughout the site, using the Pico Sand CSS framework. I also changed the button focus color for all buttons on the site. This created a sense of cohesion and unity throughout the site, removing any doubt that the two pages belong to the same site. The input forms on the recipes page are formatted in the same way with the same elements. A header followed by input fields and then a button. The repetition of this format helps make it clearer for users to know what is an action that they can take. I repeated the same top padding above each of the forms so that the groupings are more visually distinct.

**Alignment**: I used alignment to organize information on the page in several ways. I made the entire page left aligned to create a sense of unity for the page. There is a strong line on the left of the page, which creates a visual connection between the input forms. I attempted to align the input elements to the right so that the strong line would align with the table but it ended up not feeling quite right. Since English speaking users read from left to right, having the inputs read from left to right as well helps users better follow the visual flow of the page. The left alignment of the input fields also adds contrast between the input fields and the table on the right.

**Proximity**: I used proximity to organize the visual information on my page in several ways. One, by grouping together the header, input boxes, and button for each action that the user can take. This makes it easier for users to easily distinguish the different actions they can take and where they need to input information for each one. I added extra spacing between each of the groups to accentuate that they are separated, further increasing clarity. There are a total of five different groups on the page. This number include the table for displaying data and the title with the logout button and instructions. Having a smaller number of distinct groupings on the page makes it easier for users to digest the entirety of the page quickly.