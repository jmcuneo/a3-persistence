Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

## The Worst Calculator

*Application Goal:* This project is a very simple (silly) calculator. The user inputs 2 numbers, chooses an operator, and can guess what the answer might be. A table under the form will show the correct answer and if the guess was correct. The user can modify or delete the data using buttons on the table. 

*Challenges Faced:* I had a very hard time with the Github authentication. Getting the code set up wasn’t the worst thing in the world, but the many errors (CORS, 404 pages, needing links instead of GET requests) had me pulling my hair out.  

*Authentication Strategy:* I used the passport.js library and the passport-github2 to authenticate users via their Github accounts. 

*CSS Framework Used:* I used Bulma for its simplicity, single CSS CDN link, and their robust online documentation. The custom CSS I did was through client.js where I set the “Incorrect” and “Correct” text colors. 

*List of Express Middleware packages:*
1. passport-github2: Used for OAuth authentication through Github accounts 
2. cors: Prevented CORS (Cross-Origin Resource Sharing) errors that popped up when sending data to and from server. 

## Technical Achievements
- **Github OAuth**: Used the passport.js passport-github2 library to implement OAuth authentication through Github accounts. If the user has previously logged onto the webpage, their calculator data is retrieved and displayed. Otherwise, a new calculator and blank table is displayed for them. 
- **100% Lighthouse Tests**: Got 100% on the 4 required lighthouse tests (Performance, Accessibility, Best Practices, SEO). Achieved by checking the lighthouse test multiple times during development and making the needed changes. Screenshot proof is included in the repo files.

### Design/Evaluation Achievements
- **Made site accessible by the W3C tips**:
  1. “Provide informative, unique page titles” - I have 2 pages: “CS4241 Assignment 3: Worst Calculator Page” and “CS4241 Assignment 3: Login Page” which specify what the page is for in both function and assignment title 
  2. “Use headings to convey meaning and structure” - Each section that requires user input has a clear and concise heading. 
