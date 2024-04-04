## Hoyoverse Player Stats Recorder

https://a3-shimingde-a12f6f109f25.herokuapp.com/

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

This application is for helping player manage their account in diffrerent game in hoyoverse. During the development phase, the most challenging problem I meet is the connection between client and server, espacially athe manage of logged in user and their role. For password, I choose to retrieve the information from database and compare the password word in server side this can prevent injection from client. I use "Tailwind" as my css framework because it has a lot of documentation and suport.

Middleware:
1. app.use( express.urlencoded({ extended:true }) )
2. app.use( express.static( 'public' ) );
3. app.use(express.json());
4. cookie
5. logger

## Technical Achievements
- **Tech Achievement 1**: Instead of Glitch, I used Heroku for hosting wabsite
- **Tech Achievement 2**: I got a score of 100 on both page in my app

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...
  1. Provide sufficient contrast between foreground and background: I use black on background and white on foreground
  2. Ensure that interactive elements are easy to identify: All buttons are in a contrast color with the background
  3. Ensure that form elements include clearly associated labels: All input field have a label before them to identified them
  4. Provide easily identifiable feedback: There will be pop up alert on every modify/add/delete
  5. Create designs for different viewport sizes: most of the element size is witten in "%" or other resizeable unit
