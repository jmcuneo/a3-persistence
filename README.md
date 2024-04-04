- Olivia Perez: https://a3-olivia-perez.glitch.me
- Code edited directly on Glitch, here you can view the files if needed: https://glitch.com/edit/#!/a3-olivia-perez

For me the most difficult part of what I got working was figuring out how to properly implement modifying data since I didn't try to do it for the last assignment. I wanted to also attempt using passport.js and the github authentication but I didn't allot enough time to properly figure it out. The most interesting and fun part was using Picnic for CSS since I haven't used it before and using the flex classes instead of a grid was very cool to me.

## HTML:
- HTML input tags and form fields of various flavors:
   - text type
   - date type
   - email type
   - selection (from Picnic)
   - tel type
## CSS:
- I used Picnic because it seemed to be advetised for form and gallery arrangements, and my product is primarily a form
  - Used Picnic for it's default button colors
  - Picnic's flex properties used to organize headers, labels and input fields inside of forms
  - Picnic's default blue buttons were the base of my nw color pallete - matching colors from Coolors.com

## Technical Achievements

- **Lighthouse**: I got 100% on all 4 Lighthouse Tests 
![perezlighthouse](https://github.com/Perez0002/a3-oliviaperez/assets/67107221/b3237c04-0c46-4680-85d9-2258ed4cc91c)

### Design/Evaluation Achievements

- **W3C Web Accessibility**:
  - Provide informative, unique page titles: The titles of the login and app page follows the examples given on this site
  - Provide clear instructions: Follows the advice to put concise instructions in the input fields
  - Keep content clear and concise: There is no information on the page that is unnecessary to the user/testers
  - Provide sufficient contrast between foreground and background: Following the Lighthouse test advice and a color palette, i made sure there was good contrast.
  - Provide clear and consistent navigation options: All buttons act as points of navigation. They are bright colors to indicate importance to the user
  - Ensure that form elements include clearly associated labels: All labels and inputs are mathced together horizontally to keep consistant shape and easy understanding to the user
  - Associate a label with every form control: Every input has a label to the left (or above if the window is too skinny)
  - Identify page language and language changes: each html page is marked as being in engish
  - Reflect the reading order in the code order: I made sure everything in my html was grouped properly in the proper reading order
  - Avoid CAPTCHA where possible: there is no CAPCHAS needed for my project
  - Use mark-up to convey meaning and structure: I added aria descriptions to every input box
  - Help users avoid and correct mistakes: I put in a pattern for the phone number input box, and placeholders exist to let users know which type of input to input.

- **CRAP Principals**
  - I used varying shapes and colors using the Picnic CSS framework. One notable application of contrast was between light and dark backgrounds. 
    I used a light background for my HTML forms, ensuring the user immediately notices the most important part of the screen. Meanwhile, the rest 
    of the window has a darker backdrop, providing a visual distinction from less important title info and the important user input section. Using 
    Coolors, I selected a palette of complementary blues, with the base blue being from Picnic's default button color. Picnic's button classes provide 
    color differentiations between submission and deletion functions: blue for a "normal" progression button, yellow for a "warning" process and red for an "error" button. Finally, I used longer, 
    paler shapes for user input sections; and brighter, shorter shapes to signify section breaks.
  - In my project, I used Repetition to create consistency and streamline user interaction. For example, my form sections in the login and index 
    HTML pages follow a consistent form layout. Picnic has flex classes to create columns on a page, and using it, I made a repeating pattern of 
    labels on the left and inputs on the right, ensuring easy navigation of the form. I also have repetition in button design and placement on the 
    forms, with default blue buttons signifying safe actions of progression, the default yellow for safe but reversing actions, and the default red buttons for unsafe reversing of a process. Placing 
    brighter buttons on the bottom edge or right corner of an interface is common in most websites I use, so I did that in my website to enhance 
    predictability for the users.
  - I used Alignment to ensure a clean and user-friendly interface. Once again, I used Picnic's flex classes to align labels with their respective 
    inputs, creating intuitive form interaction. After feedback from Assignment 2, I also implemented margins and padding to prevent text from touching 
    the edge of the screen.These margins make the page look more full, even if the information presented hasn't changed. Each form section in index.html
    was appropriately broken up by an h3 heading, preventing information from appearing cramped in the forms. Finally, there is consistent left alignment 
    for all headings, forms, and result information. This alignment creates a clean look for my project, makes it obvious where the grid lines begin and 
    end, and also assists with readability.
  - I used the Proximity principle to enhance organization and user understanding of the website layout. Within the index.html form, h3 headers mark 
    distinct sections, providing a clear understanding of the order of navigation. I also placed every label, header, input, and button in the form 
    within a light-colored box to show the boundaries of the form and where I need the user's focus. In each form section, labels and inputs are close 
    together in horizontal lines to emphasize unity. Additionally, minimal gaps between rows in a form section show relevance of information to a section. 
    There's a slight spacing between form sections with the use of h3 headers to show distinction in topics. These gaps signify the importance of the 
    sub-groups for the user.
