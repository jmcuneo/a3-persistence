## TODO app

Railway link: https://a3-carlosmedina-production.up.railway.app/

Summary notes:

- The goal of this application was to extend my previous TODO app into a user based todo app. This means each person gets their own list.

- A challenge I faced was how to put alerts inside of the HTML to make sure that the messages were accessible and easy to notice. This led me to use `ejs`, which allows for templating inside of the HTML

- I chose the local authentication strategy with scrypt from the Node crypto library due to the ease of use.

- I used bootstrap as I have head of it before and thought it had sane defaults. I didn't make many customizations, except for the color of the alert text when log in fails.

- Example of a logged in user: ![Example of results showing on main page](/main_page.png)

## Technical Achievements

- **Tech Achievement 1** (15pt): I created an express app with various middlewares to create authentication sessions, easier json handling, and message passing, among other things. I also created routes to deal with serving pages and handling api requests. Additionally, this computes some data before sending it back for the client to populate its results table with.

- **Tech Achievement 2** (10pt): (Fulfills delete req) I have a results table that populates after a user enters a task. This will show all of a users data, and does show other users' data. In this table, there is also a button to initiate deletion of the specific task.

- **Tech Achievement 3** (15pt + 5pt): (Fulfills create and modify req and HTML tags req) I created a form that can modify or create tasks and sends the to the express server for storage. This uses a form the the post method and gives a json payload to the server to create its database models and query information with.

- **Tech Achievement 4** (15pt): I created an Atlas MongoDB database to store users and todo tasks. For this, I used the Mongoose driver and set up two schemas, one for users and one for tasks. All database accesses were done with a `username` filter to only query documents belonging to the logged in user. To do updates and inserts, I first checked if the user existed. If it didn't, I created a new model based on the schema and saved it with the contents I received from the entry form. If it did exists, I used the return document and updated the `dueDate` field. For deletion, I simply find the document with the same task name as the one received from the entry form and delete it with a query.

- **Tech Achievement 5** (10pt): I used Bootstrap 5 to create a nice looking and accessible website. Bootstrap includes breakpoints and a flex grid system so that the look of the website transitions nicely between screen sizes and doesn't undermine accessability, as they have pre chosen colors.

- **Tech Achievement 6** (10pt + 5pt): Achieved 100 on all Lighthouse scores: ![100 on all tests](/100_seo_after_robots.png)

- **Tech Achievement 7** (10pt): I used OAuth authentication via the local strategy. Two dummy accounts are set up with dummy data to show that the app separates storage based on user. `user`:`123`, and `user2`:`123`

- **Tech Achievement 8** (5pt): This site is hosted on Railway. The pros of this site were that it lets you easily add secrets, directly integrates with GitHub, and auto deploys when a change happens on GitHub or in your project. You also get a custom sub-domain, and 5 dollars of credit. The last pro is that it is fast. This can be extended as they have an optional sleep on inactive toggle. The cons were that there is no forever free tier. Overall I think it is a good site.

_Additional achievements. Points are opinions based off of complexity/work done_

- **Tech Achievement 9** (5pt): I used passport.js to create a session that carries data about the logged in user. This prevents logged in users from accessing the register and login pages. It also makes accessible the home page and the logout route.

- **Tech Achievement 10** (10pt): I created a register and login page. Both of these make requests to the `users` collection in Atlas and either registers a user, rejects a registration, rejects a log in, or accepts a log in. The accept flow redirects the user to the next page. The reject flow shows a multitude of errors, all posted as inline HTML rendered by express through ejs. Examples are below:

![username exists already during registration](/username_exists_register.png)
![no username exists login](/username_no_exist_login.png)
![incorrect password login](/incorrect_pass_login.png)

- **Tech Achievement 11** (2pt): I made a simple show/hide password checkbox on registration and login forms:
  ![shown password](/pass_show.png)
  ![hidden password](/pass_hide.png)

### Design/Evaluation Achievements

- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative:

- Provide informative, unique page titles

> My title tags describe the content of the page concisely

- Make link text meaningful

> I rewrote my links so that they fit in the sentence, and aren't "click here"

- Provide clear instructions

> Form inputs have example placeholder text

- Provide sufficient contrast between foreground and background

> All text/elements pass AA contrast checks

- Ensure that interactive elements are easy to identify

> Links are differently colored, along with buttons (which also have a cursor change)

- Ensure that form elements include clearly associated labels

> Form labels have short descriptive elements

- Associate a label with every form control

> Form labels have short descriptive elements

- Identify page language and language changes

> All pages have lang="en"

- Use mark-up to convey meaning and structure

> I use the \<nav\> tag and semantic tags inside of the results table

- Ensure that all interactive elements are keyboard accessible

> You are able to tab through all elements

- **Design Achievement 2** _CRAP principles_ : I made sure to use the contrast notion of the CRAP in all of my pages. This was done rather easily as I used the dark mode setting of bootstrap. This puts mostly white colors on mostly dark gray backgrounds, leading to high contrast. Additionally, the accent colors were blue, which has a contrast ration of 3.42:1 and a AA pass rating when used for interface components (blue: 0d6efd, background: 212529 ). The repetition element was done by using a table for received data. This lays out the data nicely, where each column represents the same type of data no matter how far down you are. All of my content is centered and margined from the sides of the screen. This makes the content flow easy to follow. I made sure to use the proximity notion of the CRAP in my forms; labels, inputs, and help text are grouped together by their proximity. I repeated the same form design across all three pages of my website as it is simple and promoted memory of where fields are.
