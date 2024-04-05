Edison Zhang Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===
## RPE Calculator and Logger

https://a3-edisonzhang.glitch.me

A RPE (Rating of Perceived Exertion) calculator to help determine what weight you should be lifting for your next set. For example, if lifting 225 lb for 3 reps felt around an RPE 8 and I want to lift an rpe 9 for a single, I can input it into the calculator and get suggested weight of 240 lb. This application can be used to log your sets to track what is the progress of your one rep max. A challenge I faced was what to store in the database, but figured that I can store the entries to have logger to track progress. I used both a simple login page that stores the user and password as a pair into mongodb. If a pair does not exist, it will create a new user. I also implement OAuth. I first implement OAuth because it is used in the industry, but wanted to try using the other method as well. The CSS framework I used was foundation, because it was simple. I made changes to the buttons and deleted a lot of the unused css, because it was reducing performance. I used express-session and axios. Express-session was used to access the session associated with the request. Axios helped fetch data from github for OAuth.


## Technical Achievements
- Implement OAuth authentication
- Get 100% in all four lighthouse tests required for this assignment

### Design/Evaluation Achievements
I followed the following tips from the W3C Web Accessibility Initiative:
- Provided page titles
- Used headings to convey meaning and structure
- Gave a definition for RPE at the bottom for users who do not know what rpe is
- Provide clear instructions on what to enter in the rpe calculator 
- Keep content clear and concise
- Associate a label with every form control
- Identify page language and language changes
- Use mark-up to convey meaning and structure
- Help users avoid and correct mistakes
- Reflect the reading order in the code order
- Write code that adapts to the user’s technology
- Provide meaning for non-standard interactive elements
- Provide sufficient contrast between foreground and background
- Don’t use color alone to convey information
- Ensure that interactive elements are easy to identify
- Provide clear and consistent navigation options
- Ensure that form elements include clearly associated labels
- Provide easily identifiable feedback
- Use headings and spacing to group related content

C: I went for a minimalistic approach since the application is an rpe calculator. It does not need any extragant color schemes. I used grey, black, and white to create a contrast. The main contrasts were the buttons, text, and the background. I want the users to clearly see the important aspects. The headers were larger so the user knows what each section is and to create a general structure. The left side is the rpe calculator and the right side kept track of the entries. The database is formatted so the user knows what each column represent and there are buttons to modify and delete entries. 

R: I went for a minimalistic approach since the application is an rpe calculator. It does not need any extragant color schemes, so there were no vidual ideas to repeat throughout. I kept everything consistent with similar color schemes between the login page and the main page. 

A: I kept every container in the center of its column to avoid excessive empty space solely on one side. However, I kept the headers on the left of the containers because having everything in the center creates too much empty space on both sides. The tables and values within the tables are centered to prevent execessive empty space when the header is larger than the values in the column.

P: I wanted to have both entry tables rpe calculator on the same page so the user can see it update live and instantly modify or delete if a mistake was made. In order to do that, I had to divide the page into two columns. Additionally, everything that was related to each other was placed into a container to create a sense of proximity. In order to not over emphasise the contianer, I only made the contrast very slightly with a gray boarder and a light gray interior versus the white background. The containers are dynamic to keep the promixity regardless of the specs of the users device.