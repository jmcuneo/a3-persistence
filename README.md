## Lucca Chantre To Do List

http://a3-luccachantre.glitch.me

login credentials:
username: lcchantre
password: lcchantre

I created a todo list with persistent data storage with mongoDB. this project features an express server, a login, a form entry with various html fields, and a results element for a particular authenticated user.

- the goal of the application is to have a todo list that can be edited and have items added and deleted, with persistent data
- a big challenge I faced was editing my post, update, and delete apis to work with mongoDB and allow data to persist, but I figured it out eventually
- I chose a simple authentication with a dotenv username and password due to time constraints, though I heard passportjs (with github) isn't too hard to implement
- I used the chota css framework due to it being very lightweight
  - the framework functioned in a way where I just needed to give keywords to my html element class names and the css would apply automatically, so my actual css file ended up being empty
- Express middleware packages:
  -cookie-session, allows cookie sessions, relating to user authentication and login
  -dotenv, environment variables that we add to the gitignore to store sensitive information
  -compression, allows text compression to improve website performance

## Technical Achievements
- **Tech Achievement 1**: I got the general achievement of getting at least 90 on all areas of the lighthouse test.
### Design/Evaluation Achievements
- **Design Achievement 1**: I used Chota as a CSS framework, which unfortunately ended up being what kept me from getting 100 on all the lighthouse tests, I got 100 on everything but performance, which was a 99 due to the unpkg from chota.
