Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

## Car Database Part 2

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

lighthouse Scores:
![alt text](https://github.com/atnguyen01/a3-AndrewNguyen/blob/main/img/Screenshot%202024-04-04%20192417.png)

Note: I didn't add cookies so if you refresh and try to add again the database will not pick up a user. You'd have to log in again

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
  - Sometimes the server breaks (it doesn't do that me when I run locally)

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
  
My site uses the principle of proximity by grouping items together. This principle is mostly involved with grouping and formatting items that are related next to each. Proximity is used to organize the visual information on my page by grouping the login form together and the table together. The login form is grouped together with the username and password fields and the submit button. The table is grouped together with the table headers and the data. Each form, which is labeled in the HTML, keeps all of its components next to each other. Also, my submit, modify and delete are separate to signify they are different forms. They show this on the site by using the HTML grid to give space between them while containing their content. 
  My site uses the principle of alignment to organize information and increase contrast for particular elements. This principle is about placement and how things that are connected are near each other while not being arbitrarily placed. Alignment is used to organize information by aligning the text and the form fields. I place text in the login pages above the their respective fields and placed them on the left side of the screen as we write from left to write. In my main page the text on my forms have instructions above and centered in their grid space. Also, I have text below the forms also centered in their grid space with examples on inputs. The headers remain center to show the titles of the pages. 
  My site uses the principle of repetition to show consistency. This principle is about repeating elements. Repetition is used to show consistency by using the same font and color for the text and buttons. In my login the text has the same CSS properties along with the two inputs having their own properties. In my main page, the table below remains consistent with text font and size when creating new data. All of my forms use the same buttons and input CSS to show consistency and that they are all interactable within the page. My text inputs all use the same bootstrap class to match while my drop downs use the same bootstrap CSS as well to match. The headers match the font of the page they are on as well. Main matches the font of the table and login matches the font of the sub header. 
  My site uses the principle of contrast. This principle is about making things stand out by making things look different by using different colors and sizes. I used contrast to make the login form stand out by using a different background color and text color. The login form has a white background with black text while the main page has a grey background with black text. The submit button is blue to signify that it is interactable. The main page follows the text being black with a white background as well. The forms also uses different colors as well specifically the dropdowns and buttons. After viewing the lighthouse information, it suggested to make the colors of the buttons red to contrast with the background the most.  