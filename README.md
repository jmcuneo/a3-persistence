## The Anagramizer V2

https://a3-milojacobs.onrender.com/

This is the Anagramizer! The goal of the application is to automatically generate and store anagrams of
a given string! 

One major challenge was figuring out OAuth. The implementation wasn't too difficult, but figuring out which parts of the tutorial were and weren't applicable to my project wasn't easy. There were different examples that all took slightly different approaches, and it took a lot of reading and thinking to figure out which parts I needed and which I didn't.

Another challenge was figuring out how to apply the correct classes and imports for Bootstrap. It took me a long time to get the dropdown menu working correctly. 

I chose to use the Github OAuth strategy for authentication. I chose this because I figured OAuth would be a useful thing to learn as I continue web development, and I of course chose Github because it was the only external account we could assume the SA's had for this assignment.

I used Bootstrap as my CSS framework because it's popular and I think it would be useful to try out for future projects. The changes I made were to support my custom buttons, add additional padding to the form elements, and make form elements display in rows using flexbox. I also had to add a custom rule to get the footer to work properly. None of the Bootstrap footer tutorials worked for me.

I used MongoDB, express-session, passport, and passport-github2. The pieces of middleware included three 
lines to initialize the session, one to use json, one to ensure database connection, and one to use the 
public folder as static resources.

- the goal of the application
- challenges you faced in realizing the application
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored
- the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please 
add a little more detail about what it does.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy using the Passport and 
Passport-github2 libraries.
- **Tech Achievement 2**: I hosted via Render rather than Glitch. It was very straightforward to deploy on.
- **Tech Achievement 3**: I got 100% on all lighthouse tests. See lighthouse.pdf for the generated report.

**Pros of Render**:
  - Automatic re-deployment whenever you push a new version to Github
  - Support for setting environment variables either directly or via an env file
  - Little to no extra setup needed for compatibility. The only minor inconvenience was that I had to change my start command in package.json to not use the --env-file argument

**Cons of Render**:
  - The free version is rather slow, especially when someone is loading the site for the first time in a while. That first load can take up to a minute, but once it's up it's not bad at all.

### Design/Evaluation Achievements
- **None.** I did 20 points of technical achievements instead.
