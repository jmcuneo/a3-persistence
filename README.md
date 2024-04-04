Jack Weinstein Assignment 3
Food Delivery Log
Site: https://a3-persistence.onrender.com

The goal of this project was to take the system I made in assignment 2 and add an account system and to integreate with a database. This would allow multiple users to log data and see it from anywhere at anytime. I faced many challenges when building this, funny enough the hardest was simply getting it to deploy to a service online. I kept running into various errors, noly some I could decipher. I found that render was the only service that could reslove all the issues automatically. I chose to use local authentication using passport as it seemed simple enough to get the job done. I chose to use Materialize as my CSS framework beacuse I like the style of Google's material design and it seemed simple to implement. I used express-session so I could track when a user is logged in.

INSTRUCTIONS:
To view default account sign in with:
username: user
password: password

To make a new account:
create your own username and password
click regsiter
then log-in

Add entries to the log by filling in the input field and clicking the add button
If the entry does not display right away, refresh the page

Acheivements
note: not sure how many points are left to be earned, so assgined each objective some points
Technical
Tech 1 (10 points): Implement local authentication with passport.js and implement hashing for passwords.
I created a passport.js file and a user.model.js file to set up the login system. My server code included routes to handle login, register, logout, and authenticate which used password.authenticate. I aslo used bcryptjs for password hashing. The challenge I ran into here was maintaining a session to check whether or not a user was logged in. For simplicity I kept track of the username of the logged in user.

Tech 2 (5 points): Host site on service that auto deploys when pushed to git.
It makes it much easier to update and test a deployed site if it auto redoplys istelf when I commit to my git repository. I attempted to use vercel but ran into errors that I could not find a solution to. I turned to render which did a goo job and resolving any errors it found when building. Render takes a while to load for the first time but is quite fast for a returning user, much faster than glitch reloading everytime you come back to it. Render also has a much easier to read log system to troubleshoot errors. Glitch was hard to read. Render also allows you to rollback to previously deployed versions.

Tech 3 (5 points): Earn 100% on all 4 lighthouse metrics.
To do this I had to add a meta name viewport and descitption to each html page, adjust the contrast netween background colors and text, and assign a label to each input field.

Tech 4 (5 points): Prevent user from navigating back to main page after logging out.
After implementing the account system, I realized that a browser's navigation buttons route the user back to a cached page. This would allow a user to logout (return to login page), and then use the broswer back button to get back to the main page and see their data. Only upon refrshing that page would the site kick them back to the login page. To solve this, I added a pageshow event listener that would force the main page to reload if it detected the use of the back button. Now a logged out user cannot see their data.

Design
Design 1 (5 points): Use Materialize framework to improve table quality and readability. Alternate shades of color for each row. Expand as entries are added.
The main table has been updated using Materialize and is now more readable and visually appealing. It grows in size when an entry is added.

Design 2 (5 points): Update edit form to imrpove visual appeal and ease of use.
The edit form now is a pop up form that can only be activate once at a time. It is easy to read and adjust fields. There is now a cancel button along with the submit button. Users can also click away from the pop up to close it.
