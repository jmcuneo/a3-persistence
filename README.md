# Code Runner

https://game.gamestream.stream and http://game.gamestream.stream


- This project runs user sumbited code in a isolated javascript instance and then shows that result to the user. Simply put your varible name and code in the form and press add. If the varible already exists, the button will change to modify. You can also hit the buttons to recalculate, modify, or delete varibles. You can also refresh the data with the refresh button. When a varible name is not allowed, it is replaced with noname# where # starts at 1 and increases as to not override other nonames. Varibles are cloned when passed to other calculations so varibles can't be modified, though their clones can be returned. The code entered is run in eval, so code can be interpreted weirdly. Most notably objects are interpreted as a block with labels inside, so: {name:value} => {name: return value;} This can be fixed by putting the object in parentheses: ({name:value})

ONLY NUMBERS ARE ALLLOWED IN VARIBLES DUE TO TIME CONTRAINTS

- Oauth was hard to get working. I spent a long while wrestling with passport stuff. I also had a hard time with mongo db queries as they are just so different from SQL. Also many online resources for mongo were old and didn't work.
- I used Github Oauth as it was a technical achievement. 
- I used Bourbon/Sass as I have used Sass slightly in the past. I made all of the buttons use a mixin.
- The middleware packages I used were:
  1. a custom function to check that the database is connected
  2. express-session: it deals with session stuff with cookies
  3. passport: it deals with oauth
  4. express.json(): it deals with converting to json
  5. express.static(): it deals with getting public files
  6. compression(): it compresses files sent to minimize data sent
  7. minify(): it minimizes static files to minimize data sent

I dont know how many points each indiviudual achievement should get but I think all of them combined plus the ones I half completed should be enough to get full points.

## Technical Achievements
- **GitHub OAuth**: I used OAuth authentication via the GitHub strategy for logins. This uses `passport` and `express-sessions`. This was incredibly hard to get working. 
- **Self Hosting**: I am hosting the project on my second computer at my apartment. I like this better than Glitch due to having complete control over the server. Also the `isolated-vm` package I used did not compile on Glitch, so I couldn't use Glitch for A2 either. I had many issues using Glitch and none when selfhosting. This is probably because I selfhost my own website as well at gamestream.stream. 
- **Sass**: I am using sass for the css. I am compiling the css everytime the server starts using it's javascript api.
- **399 Lighthouse Score**: I achieved 399 on lighthouse for both the main page and the readme page. I lost a point from performance due to my server taking too long to send data. I spent a lot of time on attepting to get the last point but I dont think there is anyway to fix it.
- **Compression**: My server compresses and minimizes files it sends to improve performance using `compression` and `express-minify`
- **Modules**: I separated my server code into modules for readability. These modules are for `database.js` for database stuff, `isolation.js` for running the user submitted javascript code, and `sass.js` for compiling the css from sass.
- **HandleBars**: I am using `express-handlebars` for the login and logout redirects so I dont need a separate page for each message
- **Https**: I am using the `greenlock` package to allow for https connections. It gets the certificate from Lets Encrypt.
- **Used >5 middleware**: see the middleware used above
- **Default Values**: added default values for the form using the placeholder atribute and changed the code so that it would use those if no other code was entered
- **Isolation**: I am still running user submitted code in isolation to prevent the infection of my device. I am pretty sure there is no way to escape. I tested it extensively, but there could be things I didn't try.

## Design/Evaluation Achievements
- **Accessibility Tips**:
  1. Changed page titles to the format given
  2. Provided clearer instructions and error messages
  3. Improved contrast ratio for the buttons, epecially the grey ones
  4. Made interactive elements stand out and change on hover
  5. Made form elements are clearly labeled with the `<label>` tag
  6. Identified page language as English
  7. Ensured that all interactive elements are keyboard accessible use `tabIndex`

## Check List

### Required
1. Implement your project with the above requirements. I'd begin by converting your A2 assignment. First, change the server to use express. Then, modify the server to use mongodb instead of storing data locally. Last but not least, implement user accounts and login. User accounts and login is often the hardest part of this assignment, so budget your time accordingly. ✅
2. If you developed your project locally, deploy your project to Glitch (unless completing the alternative server technical acheivement described below), and fill in the appropriate fields in your package.json file. ✅
3. Test your project to make sure that when someone goes to your main page on Glitch (or an alternative server), it displays correctly. ✅
4. Ensure that your project has the proper naming scheme `a3-FirstnameLastname` so we can find it.
5. Fork this repository and modify the README to the specifications below.
6. Create and submit a Pull Request to the original repo. Name the pull request using the following template: `a3-FirstnameLastname`.

### Technical
- (10 points) Implement OAuth authentication, perhaps with a library like [passport.js](http://www.passportjs.org/). 
*You must either use Github authenticaion or provide a username/password to access a dummy account*. 
Course staff cannot be expected, for example, to have a personal Facebook, Google, or Twitter account to use when grading this assignment. ✅
Please contact the course staff if you have any questions about this. THIS IS THE HARDEST ACHEIVEMENT OFFERED IN WEBWARE. You have been warned!  
- (5 points) Instead of Glitch, host your site on a different service. Find a service that is reputable and has a free tier. Post your findings on Slack in the #assignment3 channel. DO NOT feel compelled to purchase a paid tier from any service, although if you already have one, you are welcome to use it. Make sure to describe this a bit in your README. What was better about using the service you chose as compared to Glitch? What (if anything) was worse? ✅
- (5 points) Get 100% (not 98%, not 99%, but 100%) in all four lighthouse tests required for this assignment. mostly ✅

### Design/UX
- (10 points) Make your site accessible using the [resources and hints available from the W3C](https://www.w3.org/WAI/), Implement/follow twelve tips from their [tips for writing](https://www.w3.org/WAI/tips/writing/), [tips for designing](https://www.w3.org/WAI/tips/designing/), and [tips for development](https://www.w3.org/WAI/tips/developing/). *Note that all twelve must require active work on your part*. half ✅
For example, even though your page will most likely not have a captcha, you don't get this as one of your twelve tips to follow because you're effectively 
getting it "for free" without having to actively change anything about your site. 
Contact the course staff if you have any questions about what qualifies and doesn't qualify in this regard. 
List each tip that you followed and describe what you did to follow it in your site.
