# Recipe Cookbook

Link: https://a3-EllysGorodisch.onrender.com

*Note: May take long amount of time to load*

- Goal
    - Add, remove, and modify recipes in your cookbook
    - Enter the recipe name, prep time, cook time, and meal that the recipe is for
    - The total time is calculated automatically 
- Challenges
    - I had significant difficulties near the end of implementing OAuth GitHub due to my deserializeUser function being async, once I solved that things went smoothly
- Authentication Strategy
    - I used OAuth GitHub authentitcation because it was the only OAuth implementation I didn't need to make a dummy account for
    - I used OAuth authentication for the technical achievement
- CSS Framework
    - I used Pico CSS Sand because it was minimalist and had an intuitive designing process for a color scheme I liked
    - Modifications
        - I used CSS for index.html to center the button in the middle of the screen and change the font size and focus color of the login button
        - I used CSS for recipes.html to organize the page using Flexbox, add margins, shrink the size of the inputs, and change the focus color of the buttons
- Express Middleware
    1. express.static: Lets the server access files from the 'public' folder
    2. Logger: Prints the URL of all requests to the server
    3. express.json: Automatically parses JSON input
    4. Cookie Session: Initialized a new cookie session
    5. Regenerate Function: I was getting an error related to a missing function related to passport.session, found this middleware online that fixes it
    6. passport.initialize: Initializes passport.js authentication
    7. passport.session: Initializes the session authentication strategy for passport.js
    8. Collection Checker: Checks if the MongoDB collection was successfully accessed

## Technical Achievements
- **Implement OAuth Authentication**: I used OAuth authentication via the GitHub strategy for logging in to the site. User accounts are stored in MongoDB.
- **Alternate Hosting**: I used Render to host my site for this project, recommended by Milo Jacobs in the Slack. It was very convenient that it updates automatically from GitHub, but I agree with him that it is very slow to build and load. The setup was quite simple, but it is lacking features like an editor and preview window from Glitch.
- **Lighthouse Tests**: I have a 100% in all four Lighthouse tests for both pages in my site

## Design/Evaluation Achievements
### W3C Web Accessibility Tips
**Writing Tips**:
- *Provide informative, unique page titles*: Changed titles for index.html and repices.html from "CS4241 Assignment 3" to "Assignment 3" and "Recipes | Assignment 3" respectively
- *Use headings to convey meaning and structure*: Added clear headings and subheadings so that users are clear about what each section entails
- *Provide clear instructions*: Added instruction text at head of page

**Designing Tips**:
- *Provide sufficient contrast between foreground and background*: Used a dark mode color scheme with high contrast between the text and button colors and the background (confirmed using the Chrome DevTools for rendering page for people with different visual deficiencies)
- *Ensure that interactive elements are easy to identify*: Changed CSS for buttons that are focused to be more obvious
- *Ensure that form elements include clearly associated labels*: Added placeholder text for each input box so that users know what to enter into each box
- *Provide easily identifiable feedback*: Added alert for when user tries to remove or modify a recipe that does not exist
- *Use headings and spacing to group related content*: Grouped the headers, inputs, and buttons for each user action into visually distinct sections

**Development Tips**:
- *Associate a label with every form control*: Added placeholder text for each input so that users would know what to enter into each box
- *Identify page language and language changes*: Added `<html lang="en">` to the start of index.html and recipes.html
- *Use mark-up to convey meaning and structure*: Added WAI-ARIA roles and labels to main regions of the page
- *Help users avoid and correct mistakes*: Added alert for when all fields are not filled when a form is submitted

### CRAP Principles
**Contrast**: I used contrast heavily throughout my site. Since I am using a dark mode color palette, the contrast is very important. The text is very  contrasted from the background. The buttons are especially contrasted from both the white text and the dark blue background. The focus color of the buttons is highly contrasted with the normal button color, while still being contrasted with the text and the background. The focus color for the input and select fields also provides enough contrast for them to be distinguishable. The buttons received the most emphasis and contrast on each page, due to their color not being part of the blue-white monochrome palette of the rest of the page. This is important so that users can immediately know what they need to do to complete every action on the page.

**Repetition**: I used repetition heavily while creating my site. I used the same color scheme and font throughout the site, using the Pico Sand CSS framework. I also changed the button focus color for all buttons on the site. This created a sense of cohesion and unity throughout the site, removing any doubt that the two pages belong to the same site. The input forms on the recipes page are formatted in the same way with the same elements. A header followed by input fields and then a button. The repetition of this format helps make it clearer for users to know what is an action that they can take. I repeated the same top padding above each of the forms so that the groupings are more visually distinct.

**Alignment**: I used alignment to organize information on the page in several ways. I made the entire page left aligned to create a sense of unity for the page. There is a strong line on the left of the page, which creates a visual connection between the input forms. I attempted to align the input elements to the right so that the strong line would align with the table but it ended up not feeling quite right. Since English speaking users read from left to right, having the inputs read from left to right as well helps users better follow the visual flow of the page. The left alignment of the input fields also adds contrast between the input fields and the table on the right.

**Proximity**: I used proximity to organize the visual information on my page in several ways. One, by grouping together the header, input boxes, and button for each action that the user can take. This makes it easier for users to easily distinguish the different actions they can take and where they need to input information for each one. I added extra spacing between each of the groups to accentuate that they are separated, further increasing clarity. There are a total of five different groups on the page. This number include the table for displaying data and the title with the logout button and instructions. Having a smaller number of distinct groupings on the page makes it easier for users to digest the entirety of the page quickly.