## BoxFort

glitch: https://a3-patrickhunter.glitch.me/
render: https://a3-persistence-ztz8.onrender.com (note: does not support github oauth)

The goal of the project was to implement a CRUD-based website using express and mongodb. GitHub authentication was used because it had extensive documentation on how to properly authenticate users using Express, which helped improve the original authentication scheme. I used the Pico framework since it was modern and easy to use. A few CSS modifications were made, mostly to make the site more accessible. The following Express middleware was used:
* session: used to keep user data persistent throughout the site.
* passport: used to authenticate users, normally or through GitHub.
* passport-github2: connects passport.js to GitHub for authentication.

## Technical Achievements
- **Tech Achievement 1**: Used passport.js to add Github OAuth as an alternative login feature. Clicking "Use Github" from the login screen will prompt the user to connect to Github and log in.

- **Tech Achievement 2**: Achieved 100%? on all four lighthouse tests for both pages. Note that since I added authentication, there were some errors in console that occured during the test because the page was loaded without being logged in, and these errors don't happen when a user is logged in.

- **Tech Achievement 3**: Hosted website on Render. Compared to Glitch, this service was a lot slower and did not have Shell support, so this service was overall worse.

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...
* Page titles: Every page has a unique title that describes its main purpose.
* Form labels: In the login form, every input has a label describing what it is for.
* Image alt text: The hammer and brush icons each have alt text describing their functionality
* Page language: Both pages are identified as English, and there are no language changes within the page.
* Help users avoid and correct mistakes: When a login form is submitted and it fails, the website will notify the user on what is wrong.
* Provide easily identifiable feedback: On the login form, the website will highlight and describe which field is filled incorrectly.
* Use headings and spacing to group related content: On the Box Manager page, the interactive toolbar and box dashboard are grouped to the left, while the leaderboard remains on the right.
* Include image and media alternatives in your design: Both tool button icons are accompanied with text describing their function.
* Provide clear instructions: On the login form, the website provides clear instructions for improperly filled out fields.
* Background/Foreground contrast: The primary background and foreground colors contrast eachother well. Additionally, text is kept white and box colors have high values.

- **Design Achievement 2**: To adhere to CRAP principles, I made the following choices:
* C: Not only do background and foreground elements contrast in value, but the color options for each box are unique and contrast with the other colors.
* R: As the amount of data grows, all actions on this website remain the same. Adding a new box never changes, deleting and painting boxes remains the same, and the leaderboard will only grow longer.
* A: The left side of the box manager contains all the interactive elements, while the right side contains the uninteractive leaderboard.
* P: On the left side, the toolbar and main box area are very close to each other, implying that the toolbar is associated with the boxes. Additionally, the add box button is always at the tail end of the box area, which implies that it is also associated with the box area.