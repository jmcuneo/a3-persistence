## What To Bring

https://a3-noracleary.glitch.me

What To Bring is a tool for communicating and tracking the item each person is contributing. The application is a simple and organized, and can be used 
for events like potluck parties, organizing an event, roommates moving in together, etc.

- Challenges- The biggest challenge I faced was dynamically including the remove buttons each time a user submitted an item to bring. 
I had problems with event handlers and finding the index, as well as passing this index to and from the server. After successfully implementing the remove buttons, I included
a similar feature with the suggest button, which dynamically adds a bring button with a seperate event handler.
-  Authentication  - I chose to do the OAuth authentication with the passport library. I chose this method 1). because of the technical acheivement and 2). because of the vast amount of resources I was able to find online. Upon some 
quick searches, passport.js had lots of guides, videos, and discussion forums that proved to be very helpful throughout the process.
- CSS framework - I used Bootstrap because, like passport, there were lots of resources and documentation on the framework. This was my first time using 
frameworks, so I wanted to keep it simple and ensure I had resources to help me.
  - I made minor changes to the CSS framework, like the color scheme, fonts, and the buttons, including shading when they are clicked.
-  Express middleware packages
add a little more detail about what it does.
  1. cookie-session -> Establish cookie-based session with a secret key and a one-day expiration
  2. passport -> OAuth autentication strategy
  3. serve-static -> combine req.url file to the provided root directory
  4. body-parse -> only parses content with header that matches the given type (json) 
  5. custom -> custom middleware to check if mongodb is connected, send 503 status is mongo is not connected.
  6. compression -> compresses http - improved performance on google lighthhouse

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy and passport.js library.
- **Tech Achievement 2**: 100% Google Lighthouse score. The most challeging aspect was getting the Performance and Accessibility to 100% while still mainting the design I wanted.
To get a better accessibility score, I edited my HTML tags, ensureing they had accurate descriptions and had aria-labels. 

![image](https://github.com/ngcleary/a3-persistence/assets/120121240/76ff240f-786d-4044-a2ef-16a3e18e1553)


### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the CRAP princeples from the Non-Designer's Design Book readings:
  1. Contrast: While creating contrast throughout my webpage I made sure to make any differences intentional and obvious. For example, I wanted to ensure the table headers were not mistaken for additional instructions which were provided in a smaller font at the top of the page. In order to create contrast I increased the font size significantly and bolded the headers. I intentionally expanded the center of the page, where the data is displayed, to draw the users attention and create a significant difference from the instructions and input boxes above, which have much more margin space on the left and right. This creates a very obvious divide between the units, indicating the elements taking up more space on the page are more significant, and to keep the users attention by creating visually interesting shifts.
  2. Repetition: In order to create unity throughout the page I relied on a repeating color palette, buttons shapes, button colors, and fonts. I used a dark green shade to signify a heading, using it as the background for the header as well as the background for the table headings. This repetition creates unity without overusing this color. Consistently using the green to signal headers maintains consistency in the design and indicates what the user should expect. I also constantly used the yellow color for the buttons that are always present on the screen. I used a white color for the buttons in the table, as unity is best when there is variety, and having an entire column of yellow buttons would be overwhelming. I also used the same font throughout, only varying the boldness and size. This creates variety and contrast while still repeating the same font type to establish a consistent style. Additionally, as described above, I used a left aligned text above the tables and list so the user knows where to look for constant text information.
  3. Alignment: I felt the instructions and input boxes looked best when center aligned. However, a center boundary line is weak and creates a flat design. In order to give the eye a visual boundary to land on, I made a hard left edge within the center-aligned instructions. This maintained the center unit, a united block which includes user input and instructions, but made it more visually interesting than center aligned text in a center aligned block. This also makes it more readable, as the hard left edge gives the eye a place to start and stop in a way they are familiar with. For the table and list displays in the middle of the screen, I centered the alignment but created a larger margin on the left and right side of the screen. This creates a hard left and right edge and limits the amount of the screen the eye has to look through at once. This helps control where the eye starts looking and where it ends up. I also aligned the headers of the tables and list on the left, using the hard border to create consistency and also control where the eyes go. 
  4. Proximity: To adhere to the proximity principle I first established the elements that make up one unit or group. I aimed to have no more than 3-5 visual units, so as to not overwhelm the page. My first unit is the instructions and input boxes, which are grouped together in close proximity and alignment. To create contrast within the unit I changed the instructions to be left aligned while still grouping it with the center aligned input boxes below. The second unit is the dynamically created tables. I included significant space above the tables to visually separate them from the instruction unit above. I maintained contrast by using a bold header but kept the header physically close to the unit it describes. For my third unit, I went back to center alignment to ensure the box was physically different from the tables above. This makes the page more organized and controls the start and stop point of the eyes.
- **Design Achievement 2**: I used CSS styling to create an animated toggle button.


