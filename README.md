## Shrimple To-Do List

https://a3-darrenni-production.up.railway.app/

## Goal

The goal of my application is to provide a s(hr)imple to-do list that allows users to insert, delete, and edit. It will suggest a reasonable due date for the list item based on the priority inputted by the user.

## Challenges

The main challenge I faced was figuring out how to use the different hosting providers. Some had different quirks that took me some time to figure out. For example, in Railway, the provider I am using for this assignment, environment variables should not include quotation marks, or else they will not be recognized. Some other challenges include trying to figure out how to use my chosen authentication provider, Auth0, as the documentation is relatively hidden away.

## Authentication Strategy

I originally was going to use passport.js, but while clicking around their site I ended up at the Auth0 website without realizing, so I just went ahead and used that instead because their website looked nicer. Authentication can be done either with Github login or username/password.

## CSS Framework

I used Bootstrap because I looked up "best css framework" and it was number 1. I only made minor adjustments to color for some of the elements.

## Express Middleware

I used a custom middleware for all GET and POST requests (app.get and app.post) to customize the responses. In addition, I used `express.static` to serve all my files and `express.json` to parse application/json headers that are sent to the server from the client. For authentication, I used middleware functions from `express-openid-connect` to deal with authentication and its related routing.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication with Auth0. The user can use either Github or username/password to log in.
- **Tech Achievement 2**: I used a service called Railway as the hosting service instead of Glitch
- **Tech Achievement 3**: Lighthouse evaluation of both pages of my website shows 100%.
  - ![page 1 Lighthouse](/page1Lighthouse.png)
  - ![page 2 Lighhouse](/page2Lighthouse.png)

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative
  1. Provide informative, unique page titles
  2. Use headings to convey meaning and structure
  3. Make link text meaningful
  4. Write meaningful text alternatives for images
  5. Provide clear instructions
  6. Keep content clear and concise
  7. Provide sufficient contrast between foreground and background
  8. Ensure interactive elements are easy to identify
  9. Ensure form elements include clearly associated labels
  10. Identify page language and language changes
  11. Reflect the reading order in the code order
  12. Write code that adapts to the user's technology
- **Design Achievement 2**: For the contrast, I set the submit and delete buttons to stand out more to the user than the edit button, because it is more likely for a user to be using those functions than the edit function. I also made the refresh results stand out less because the web app will refresh every time an action is taken, and a user will only have to manually refresh if the database is slow. For repetition, I kept the "Log Out" button the same color, and generally used the same color scheme to keep everything consistent. For alignment, everything is aligned in a logical manner that the user can easily understand. For proximity, the form elements are grouped close to each other, and the table that shows the database is slightly separated.
