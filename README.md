## https://a3-andresnegron.glitch.me
https://glitch.com/edit/#!/a3-andresnegron

### NOTE
Sorry for the late and partly incomplete submission. This is no excuse, I just thought I'd mention what's going on. This past two weeks have been really intense personally, I had to hand in my final MQP report and presentation poster and a family member got really sick. I stressed and a bit behind on this class and so I didn't have time to have the server running correctly, so I decided to instead submit my A2 assignment with as many achievements as possible outlined on the instructions for A3 to try to at least get some points while I get back on track for the rest of the assignments. Again, this is not excuse, just an explanation for how this assignment turned out for me.

# WPI Virtual Postcard Designer

- This is a single page app where users can create/delete postcards, they get saved to a grid.
- postcards can be created and deleted by different users, like I said above, I couldn't get the server working on time to have it be persistent. I did go through a lot of those steps on Mongodb, I just coudn't get my uri to connect properly so I went back to an older version.
- Added CSS styling with Bootstrap, such as class="mb-3".

## Technical Achievements
- **Tech Achievements**:
   ## - Lighthouse results are 100% on all categories:
    - https://pagespeed.web.dev/analysis/https-a3-andresnegron-glitch-me/k2ci7cazu8?form_factor=desktop 

### Design/Evaluation Achievements
- **Design Achievements**:
  - various hmtl tags: textarea, dropdowns, buttons, labels, input, etc.
  - only showing data for current user in session, also a user needs to be logged in to create postcards.
  
  - From 'tips for writing' link:
    
    - Provide informative, unique page title: title is WPI Virtual Postcard Designer.
    - Use headings to convey meaning and structure: the two headings are 'Design Your Postcard' and 'Your Saved Postcards'.
    - Make link text meaningful: not applicable.
    - Write meaningful text alternatives for images: added alt attribute to, for example, the img tags.
    - Create transcripts and captions for multimedia: no multimedia apart from images, which include alt tags.
    - Provide clear instructions: the headings and labels should smooth guide the user, alongsaide the bright blue 'Save Postcard' button.
    - Keep content clear and concise: I tried to as much as possible by having no long paragraphs, just labels.
  
  - From 'tips for designing' link:
  
    - Provide sufficient contrast between foreground and background: increased contrast between buttons and boxes with backgrounds, all types of inputs have labels either outside and/or inside it.
    - Don’t use color alone to convey information: I don't believe that is the case.
    - Ensure that interactive elements are easy to identify: the only interaction is to save the postcard, and that button stands out in blue.
    - Provide clear and consistent navigation options: not applicable, there's just standard scrolling.
    - Ensure that form elements include clearly associated labels: every input box has labels or text inside to indicate what should go in it.
    - Provide easily identifiable feedback: when saving postcards, a success box a appears, same when not logged in and when logging in.
    - Use headings and spacing to group related content: I believe that is the case, it's open to interpretation though.
    - Create designs for different viewport sizes: boxes shrink according to width, and the postcards grid reduces the amount per row.
    - Include image and media alternatives in your design: added alt attribute to, for example, the img tags.
    - Provide controls for content that starts automatically: not applicable.
    
  - From 'tips for development' link:

		- Associate a label with every form control: used the id  attribute in label tags to associate them with corresponding form controls.
		- Include alternative text for images: added alt attribute to, for example, the img tags.
		- Identify page language and language changes: used the lang html tag.
  		- Use mark-up to convey meaning and structure: used html elements such as header, nav, main, section, article, and footer.
		- Help users avoid and correct mistakes: when not logged in, users get an error message to log in, same when you log in and when saving a postcard.
		- Reflect the reading order in the code order: html elements appear on the code on the same order as they appear visually on the page.
		- Write code that adapts to the user’s technology: boxes shrink as much as possible as the saved postcards grid changes the amount of postcards per row based on the window width.
		- Provide meaning for non-standard interactive elements: not applicable.
		- Ensure that all interactive elements are keyboard accessible: by pressing tab and enter you can move between input boxes and save your postcards.
