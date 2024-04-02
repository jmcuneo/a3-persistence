Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Szymon Mamro



## Student Database

https://a3-szymonmamro.glitch.me

- the goal of the application was to create a register and login page in order to access a student database that adding, updating, and deleting capabilities
- I tried to implement passport-local as it seemed like it would be the easiest but after following many different tutorials none of them seemed to work,
but ended up making a pseudo authentication - explained in my technical achievements

- I used the sakura CSS framework because I thought it had the nicest formatting for how I wanted my pages to look
  - the only thing I changed were the sizes of some of the textboxes that it had, so it didn't look as out of place

- To login make sure you register first as there is no hard corded "admin" account for you to use

## Technical Achievements
- Created register page to be able to input a username and password you want, which is then encrypted and saved. It gives an error if you try to make a username that is already taken
- Created a login page with username and password inputs, only authorizes you and allows access if both username and password match exactly to one of those saved.
- I wasn't able to figure out exactly how to use passport.js correctly so there's a lot of code in my program that sets it up but isn't used anymore. That's because instead I
- decided to store the usernames and passwords (still encrypted) server side to more easily retrieve them since I didn't know if it was the database that was causing it to mess up
- Then I just created a variable "authorized" that was 'false' until you successfully logged in, in which it would save to 'true'
- Then using this variable I would allow or disallow you to simply type in the url where you wanted to go (if unauthorized you can travel between /login and /register, trying /app redirects
you back to /login. if authorized it's the opposite)
- Used both textarea html and input html to show various input and form fields
- The app page says hello to whichever username is logged in showing that its showing data for a particular authenticated user
- Implemented mongodb to store all the information from a2 and also set it up to store the usernames and passwords (although didn't end up being used)
- changed program to use Express

### Design/Evaluation Achievements
- All 3 pages scored 100% in all 4 categories using the Google Lighthouse 
