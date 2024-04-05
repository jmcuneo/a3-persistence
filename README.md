## Paint Live

https://a3-andrewsalls.glitch.me

![image](https://github.com/AndrewSalls/a3-persistence/assets/77992504/0a82757a-f7f7-4980-8607-2559ef2878b6)
The goal of the application is to create a simple collaborative/competititve art tool where multiple people can edit a small picture online. In order to prevent hypothetical bots and spammers, the application requires a login, and limits users to one edit a minute.

![image](https://github.com/AndrewSalls/a3-persistence/assets/77992504/ed4ecf81-02be-4041-aecb-aee06986859a)
My main challenge was the lack of description/documentation for Mongoose functions (especially since all of their function signatures are a million lines long), and accounting for dates. The JS hive mind strikes again, as veryone online just responds to questions about dates by saying that they are in UTC, ignoring that creating a time in UTC requires first converting from the current non-UTC time, which means that creating a Date object is highly dependend on location. This was a problem because I was originally using Mongoose's timestamp functionality, which was somehow two hours off local time despite the servers being in Virginia, which is also EST.

![image](https://github.com/AndrewSalls/a3-persistence/assets/77992504/36209c62-fd07-4bde-8d2e-9ed6628ebe67)
For authentication, I used a regular username-password system, with the user's username and password being saved to the cookies. However, this is an actual account system - the system won't automatically create an account for you, and multiple accounts are supported. Attempting to access the main site without being logged in redirects the user back to the login page, and users should not be able to submit changes for pixels (or even load the JavaScript that is capable of doing so) without their credentials.

I used Pico.css because it had a similar overall design goal to the css I had before but with more effort put in. I needed several CSS modifications, mostly to layout, but I did have to nuke submit input types because I use those as my way of displaying pixels and allowing them to be modified, and Pico.css' tries to add additional rounding and padding to turn the pixels into a typical form submit button.

Express middleware packages:
- cookie-parser.js: Provides access to a cookies object in sever request repsonses that contains each value in the client cookies as a separate entry in the object.

## Technical Achievements
**100% on Lighthouse**: I did that.

### Design/Evaluation Achievements
**W3C WAI**: I followed the following tips from the W3C Web Accessibility Initiative...
- Provide informative, unique page titles: I set a page title that describes what the purpose of each page is.
- Provide clear instructions: Every input has a label, and notifications popup upon entering something invalid.
- Keep content clear and concise: Mostly already given by my lack of text, but the sidebar's display time was modified to display a time as a readable amount of time units instead of as a giant number of milliseconds.
- Provide sufficient contrast between foreground and background: Pico.css has high contrast.
- Ensure that interactive elements are easy to identify: A combination of Pico.css for standard form elements, and similar edits for the pixels since I had to override Pico.css's defaults.
- Ensure that form elements include clearly associated labels: They do.
- Provide easily identifiable feedback: Notifications pop up upon successfully creating an account, successfully editing a pixel, and upon any error. I also display the time remaining until a user can make another pixel edit if they attempt to edit a second time in under a minute.
- Associate a label with every form control: I did.
- Identify page language and language changes: There is no foreign languages and the pages are both labelled with en-US, the language I used to write them.
- Use mark-up to convey meaning and structure: I use an aside to mark the sidebar, forms to mark forms (even when loading a new page is not required), and added WAI role attributes and some aria tags.
- Reflect the reading order in the code order: The structure of the pages matches the markup, with the sidebar HTML appearing at the bottom of the markup because, read left-to-right, it is the last thing on the page.
- Ensure that all interactive elements are keyboard accessible: You can press tab to cycle between all interactive elements, and enter on the login, logout, and create account buttons to activate them (I specifically disabled hitting enter in the username/password text fields since it would be unclear if the user wanted to try and create an account or try and login).
