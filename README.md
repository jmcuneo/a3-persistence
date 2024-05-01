## Maze Generator Beta 1.2

## Summary
This application is a simple maze generator. Giuen a set of parameters, it creates a rectangular tile-based maze. While the maze isn't currently
interactable.
When the player presses play, they can enter a maze.
Controls:
WASD: Move
Space: Flash. You recover flashes slowly as you play.
NOTE: A player can only make an input action every 1.1 seconds.
In the maze, there is something also walking around. Be careful, as too much activity while you are near it will anger it.
You might be able to see it with your flashes.

## Challenges
-Code Refactoring (Cleaning up Code and Preventing Circular Dependency)
I wanted to separate some of my code into separate files in order to make it cleaner. However, just moving my code into a separate file would cause circular dependency issues due to my imports.
I ended up making a middle-man file called actionManager. The server receives requests from the client and then sends a message to the actionManager. The actionManager has access to various other files responsible for
a multitude of things, and can perform these actions. While my code is a lot easier to navigate now, this did take an extremely long time to set up.

-Enemy Behavior
I wanted to set up enemy behavior that was functional and a bit complex, but also allowed flexibility for future modifications.
This took a rather long time as I had to account for multiple situations when designing it.

-Playtesting
Doing tests for this was difficult due to not having an interface to see how my program runs.
So while I believe everything should be working, there may be rare bugs that I haven't noticed due to not being able to visualize things like enemy AI.


## CSS
I decided to go with the NES.css. Since I'm generating a simple maze, I feel like a game-oriented style would be fitting. I didn't really make any modifications to it though.

## Express Middleware Packages
-Express-Session
This hands over managing the user sessions to the package, making it easy to authenticate and keep track of users.
-Express-WS
Used to allow the server to send client messages without needing the client to send a message first.

## Technical Achievements
- **Tech Achievement 1**:I used express-session alongside mongodb to manage users, their mazes, and keep track of user sessions.
- **Tech Achievement 2**:I utilized a depth-first search to generate a maze that I could display on a canvas.

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...

## Sample User
Username:User1
Password:ABC

Can also create your own user as well.