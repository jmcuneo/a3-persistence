## Maze Generator Beta 1.2

## Summary
This application is a simple maze generator. Giuen a set of parameters, it creates a rectangular tile-based maze. While the maze isn't currently
interactable.
When the player presses play, they can enter a maze.
Controls:

## Challenges
-User-Data Association
While I can associate a maze with its creator using mongodb, I
didn't know how to preserve user credentials.
I ended up looking at the middleware express-session to keep track of the user's session.

-Maze Generation
While I followed the initial guide of using depth-first search, I
wanted to allow more variety in my mazes' designs. For instance, one 
of the current parameters is Amount of Exits. This creates a maze with multiple exits. Although, with its
current design, mazes with multiple exits do end up having areas of open space in them.

## Authentication
As mentioned previously, my authentication strategy used the express-session middleware. I felt it was easier to implement than other
options (mainly since) doing it manually would be more limiting and difficult. Also, it is based around express, so it felt appropriate.

## CSS
I decided to go with the NES.css. Since I'm generating a simple maze, I feel like a game-oriented style would be fitting. I didn't really make any modifications to it though.

## Express Middleware Packages
-Express-Session
This hands over managing the user sessions to the package, making it easy to authenticate and keep track of users.

## Technical Achievements
- **Tech Achievement 1**:I used express-session alongside mongodb to manage users, their mazes, and keep track of user sessions.
- **Tech Achievement 2**:I utilized a depth-first search to generate a maze that I could display on a canvas.

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...

## Sample User
Username:User1
Password:ABC

Can also create your own user as well.