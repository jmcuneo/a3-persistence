## Your Web Application Title

your glitch (or alternative server) link e.g. http://a3-joshua-cuneo.glitch.me

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of the application
- challenges you faced in realizing the application
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored
- the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please 
add a little more detail about what it does.

## Technical Achievements
- **Tech Achievement 1**: Hosting on alternative service: I decided to use Render as a hosting service. I’m using the free version and using web service hosting. Besides it taking me forever to figure out that I needed a web service and not a static site, it was very easy to set up. I just needed to add in my environment variables and the rest was all set up through my package.json file that was already there. Overall, Render is great with the auto-deployment when changes are pushed to main and works fairly well speed wise given the free version. Overall it seems better than Glitch given the auto-deployment and more functionality with changing settings and such. Although, you can’t edit things directly in Render unlike Glitch.
- **Tech Achievement 2**: I got a 100% in all of the Lighthouse scores for desktop.
- **Tech Achievement 3**: 

### Design/Evaluation Achievements
- **Design Achievement 1**: Implement 12 Tips from W3.org
1.	Provide sufficient contrast between foreground and background: For the background, I have an off shade white with black text throughout. All the colors I used are not too bright and are more dull colors in order to make sure doesn’t blend in too much but also not too bright.
2.	Ensure that interactive elements are easy to identify: For all my buttons, they change a shade of color when they are hovered over. It also changes the cursor to identify that it is clickable. For the radios, it also changes slightly to show the user that they can click and the cursor changes. And then my field inputs change cursor and highlight in blue when clicked to show that the user can type something.
3.	Ensure that form elements include clearly associated labels: For my form inputs, all of them have labels to the left of the input as well as the text inputs having placeholders in the field indicating what to enter.
4.	Provide easily identifiable feedback: When the user forgets to input in one of the fields or inputs the data incorrectly, it will give feedback in the form of an alert to tell the user to input or change how they inputted the data.
5.	Create designs for different viewport sizes: When the width of the screen is smaller, it will put the labels for each input above the input field so that there is more room for the user to enter text. The table also sizes based on the width of the screen, making it adaptable for many screen sizes (although it does have a min width of around 600px).
6.	Provide clear instructions: When the user doesn’t input things in the input fields correctly, I give information instructions on how to fix including things like fill in all the fields or input the date in the specified format. This makes it clear that all the inputs need to be filled in for the user to be able to submit a task.
7.	Associate a label with every form control: Each of my inputs for both sign in and the submitting data has a label associated, making it easy to see when reading the code and for the user as well.
8.	Identify page language and language changes: I indicated the language as English on every page.
9.	Help users avoid and correct mistakes: I provide clear instructions if the user inputs data correctly so that they know what they need to change and where to change it.
10.	Reflect the reading order in the code order: All the code in the HTML displays in the way that it is displayed in the app with everything that is visually on top, also on top in HTML.
11.	Write code that adapts to the user’s technology: The code specifically for the table is meant to adapt to the user’s screens width as well as the input fields adapting to the width and changing the position of the labels if it gets below a certain width.
12.	Don’t use color alone to convey information: Everywhere that I use color, it is in addition to text that is used with it. This allows things to have emphasis with the color but still makes it clear with what it is for.

- **Design Achievement 2**: Following CRAP Principles
- Contrast: For the use of contrast, I used colors to help with emphasis of elements on the page. With the table results, the table was a different color than the rest of the page to put emphasis on it and lead the user to looking at that. This was the element that had the most emphasis on the page with it being large and using the color to emphasize it. I also used font size and utilization of bolding to make the titles like “Add Tasks” and “View Tasks” to pop, allowing the user to easily tell which section is which. I also emphasized the Submit and Logout buttons by making them a bolder color to signal to the user that these are important. However, the edit and delete buttons are not as emphasized since they are gray. This is because there are a lot of these buttons and not as important as the others. 
- Repetition: One way I use repetition is with the use of bolding for all the titles and subtitles in the page. This makes it easier for the user to navigate through the page. I also use repetition for all the input fields for submitting data by making them all the same size and looking consistent with text. This makes it easier for the user to navigate through each field and input the correct values. I also used repetition with the table. It repeats the alternation of the colors as well as keeping all the text and spacing consistent as well as the same buttons for each row. Again, this makes it a lot easier to navigate and find the right information that the user is looking for.
- Alignment: When looking at my table, I keep the alignment consistent throughout. First, all the elements are aligned to the left, creating consistency and making it easier for the user to read since the elements are different sizes of text (as compared to doing center align which wouldn’t be as visually appealing). When looking at the adding tasks, these are also aligned to the left with each input field being aligned together both horizontally and vertically. The radios for the importance input are also aligned with the other input fields to create this consistency. Also when looking at my login page, everything here has a center alignment since the elements are smaller and makes more sense to fill up the page in the middle instead of on a side.
- Proximity: One way I used proximity is in my table. First, I put the task and class elements next to each other since they are both text-based answers and relate to each other. Then I also put importance and priority next to each other since they are related, allowing the user to see both of them together. I also have the edit and delete button together since they are both buttons that will lead to modification of the task. Also with the Log Out button, I have the username of the person right next to so that when you are logging out, you know which account you are signed into before you make the decision to logout. Also more obviously, all the things for adding a task are in near proximity to each other as well as all the things for displaying results with the table instead of being spread out all over the page. 











Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Check out the [CS 4241 Guides](https://github.com/jmcuneo/cs4241-guides) for help with the technologies discussed in this assignment.

This assignnment continues where we left off, extending it to use the most popular Node.js server framework (express), 
a database (mongodb), and a CSS application framework / template of your choice (Boostrap, Material Design, Semantic UI, Pure etc.)

Baseline Requirements
---

Your application is required to implement the following functionalities:

- DONE (15 points) a `Server`, created using Express (no alternatives will be accepted for this assignment)
- DONE (10 points) a `Results` functionality which shows all data associated with a logged in user (except passwords)
- DONE (15 points) a `Form/Entry` functionality which allows users to add, modify, and delete data items (must be all three!) associated with their user name / account.
- Persistent data storage in between server sessions using [mongodb](https://www.mongodb.com/cloud/atlas) (you *must* use mongodb for this assignment). You can use either the [official mongodb node.js library](https://www.npmjs.com/package/mongodb) or use the [Mongoose library](https://www.npmjs.com/package/mongoose), which enables you to define formal schemas for your database. Please be aware that the course staff cannot provide in-depth support for use of Mongoose.  (15 pts.)
- DONE (10 points) Use of a [CSS framework or template](https://github.com/troxler/awesome-css-frameworks). This should do the bulk of your styling/CSS for you and be appropriate to your application. 
For example, don't use [NES.css](https://nostalgic-css.github.io/NES.css/) (which is awesome!) unless you're creating a game or some type of retro 80s site.

Your application is required to demonstrate the use of the following concepts:  

HTML:  
- DONE (5 points) HTML input tags and form fields of various flavors (`<textarea>`, `<input>`, checkboxes, radio buttons, etc.)
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
- DONE BUT CHECK (10 points) Your site should achieve at least 90% on the `Performance`, `Best Practices`, `Accessibility`, and `SEO` tests 
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
