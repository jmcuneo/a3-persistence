## Assignment A3 - Austin Rebello

Link: https://a3-austinrebello.onrender.com/
<br>**PLEASE NOTE:** Render can take up to a minute to fully spool up the server from idle, it is slow, but the link DOES work.

The goal of this application was to create a login system that allowed website content to be shown only to specific users, only showing the content actually belonging to them.
I encountered several challenges when completing this assignment. One was the alternative hosting methods, which were a bit touchy in getting the server up and running.
Another challenge was the login system itself, as tracking users across the site once logged in was initially difficult to get just right plus the requirement to only show content pertaining to them.
I chose to use an authentication method that checks if the user's login credentials exist in my mongoDB database, which I felt was the best solution given its moderate difficulty and my available time.
I chose to use Bootstrap since I have used it before / currently on other personal projects, and felt very comfortable with how Bootstrap works and getting the content to look how I wanted it to.
I only made minor changes to the framework, manually editing some widths since bootstrap only has 25/50/75/100% width, and adding custom fonts via a CSS file.
The five Express middleware packages I used:
  - Cookie-Session: This middleware enabled login tracking across all pages.
  - app.get(): This middleware was used to handle the GET requests.
  - app.post(): This middleware was used to handle the POST requests.
  - app.listen(): This middleware was used to listen for / open a port for the server to host on.
  - app.use(): This middleware was used to handle custom functions, such as verifying if the user is logged in, or if the databases were connected.

## Technical Achievements
- **Alternative Hosting**: Per a recommendation I saw in the #assignment3 Slack channel, I used Render instead of Glitch to host my site for free. This was slightly challenging to initially get working, but once the project was connected, it was just as easy to use as Glitch. The only major drawback is that the site, when in idle mode, takes a LONG time to get woken up and user ready.
- **100% on Google Lighthouse Tests**: I spent a great deal of time trying to get to 100% on Google Lighthouse, which was a struggle mainly because of how I was initially importing Bootstrap to my application. Since I was importing via CDN, it was causing performance to suffer a couple percentage points, but per a suggestion in the Slack channel, downloading the CSS and JS files needed and putting them directly in my project fixed this issue. Below are images showing the four 100%s for both the Index and Main page.
![GoogleLighthouseIndex](https://github.com/AustinRebello/a3-AustinRebello/assets/55983501/a891b3a9-5ab3-4f88-8d51-1d69e97e5942)
![GoogleLighthouseMain](https://github.com/AustinRebello/a3-AustinRebello/assets/55983501/df758c51-dec4-41e9-96ac-5ef3ae8fac9e)

<br>

### Design/Evaluation Achievements
- **Site Accessibility**: I followed the following tips from the W3C Web Accessibility Initiative...
#### Developing for Web Accessibility
1. ***Associate a label with every form control***: Every form control **DOES** have a label.
2. ***Include alternative text for images:*** The image used in the top left does have alternative text included.
3. ***Identify page language and language changes:*** Page Language is identified at the top of both main and index pages.
4. ***Reflected the reading order in code order:*** The code has all three forms in order, followed by the table, as reflected on the web page.

#### Designing for Web Accessibility
5. ***Provide sufficient contrast between foreground and background:*** Color scheme has stark contrast between the text, its containing elements, and the background of the site.
6. ***Ensure that form elements include clearly associated labels:*** All form elements have their labels directly associated either above or alongside.
7. ***Use headings and spacing to group related content:*** This tip was incorporated in the spacing and layout of the forms and the table on the main page, as well as the login form on the index page.

#### Writing for Web Accessibility
8. ***Provide informative, unique page titles:*** Both pages have unique and descriptive titles describing each page.
9. ***Use headings to convey meaning and structure:*** Headings were used to convey the different structure of the forms and the table, separating the content.
10. ***Write meaningful text alternatives for images:*** Wrote a meaningful alt text for the WPI Logo image.
11. ***Provide clear instructions:*** Login instructions for the website were clear and descriptive.
12. ***Keep content clear and concise:*** Instructions for logging in were clear and concise, and the information presented on the main page is neat and concise.
