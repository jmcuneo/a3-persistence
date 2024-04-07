# Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template

## Ivy Bixler

## Catabase

your glitch (or alternative server) link e.g. http://209.97.153.18:3001/login
I called it catabase, its the database for cats! There is a test user 
username: test
password: test

- store data about users cats
- getting images to upload from the client
- I implemented JWT's because it seemed like it was the most simple and applicable to this application. I also ran out of time a little and didn't get to polish the form entry fields and provide robust validation
- I would have liked to get tls working
- what CSS framework you used and why
  - i chose sakura css because i felt it had a simple, easy on the eyes, timeless look
- libraries used
  * jsonwebtoken  
    * authentication, once a user authorizes they get a cookie and pass it in all subsiquent requests. Once it expires the user is kicked back to the login page.
  * mongodb
    * Mongo Client
      * used for basic connections
    * serverapiversion
      * used to be precise about the communication protocol
    * GridfsBucket
      * unfortunately I could not get photo uploads working. the way I setup my frontend was messy and given time I would rewrite it to give it better functionality
      * so its not used but there is code that depends on it but isn't used
  * Bodyparser 
    * used to parse text from the client's request
  * path
    * used for some image code I left in because i just wanted to include the effort
    * it is used to store things on the server temporarily
  * env
    * used to manage the various secrets associated with such a project


## Technical Achievements
- **Tech Achievement 1 3pts**: I used JWTs to manage user authentication, once a user logs in successfully they get a token which expires after a few minutes and get booted back to the login
- **Tech Achievement 2 5pts** I deployed the project to an ubuntu vm running on a digital ocean droplet. setup was pretty simple, I just had to get git ssh keys setup for the machine. 
- **Tech Achievement 3 2pts** This is not entirely an achievement because it never ended up panning out but I wanted to be able to upload images of the cats.
  - difficulties
    * client used a giant function for doing all of the requests to the server using a post method
      * i promise i will never do that again but it caused trouble because i was passing the form data as a string not just dumping in the data
      * i didn't pass anything in the url which i should have for images
      * downloading all the images from the db would have been difficult
    * I did manage to get an image into the database which is the easy part
- **Tech Achievement 4 5pts** The Lighthouse tests passed tested see lightouse.png

### Design/Evaluation Achievements
- **Design Achievement 1 6pts**: I followed the following tips from the W3C Web Accessibility Initiative...
  1. writing for web accessibility
    * Renamed each page to reflect the action taken
  2. Use headdings to convey meaning and structure
    * added information about each data field and described it
    * used headings to split up the information
  3. I skiped ones that i do not have content for
    * I provided clear instructions for sign up and entering a cat
  4. Make link text more clear 
    * i altered buttons to say something like return to login instead of login
    * instead of submit i said submit a cat
  5. Sufficient contrast 
    * I chose a css template that is very easy on the eyes with plenty of contrast
  6. Not color alone
    * The text alerting the user has some punctioation attached to it to call attention that all fields must be filled
    * the text also appears when a field is left out
  7. Interactive elements 
    * i edited my css template slightly to better suit keyboard tabbing focus, i just duplicated the mouse over behavior
  8. Labeled every text field clearly
    * I added an internal label to text entry fields
