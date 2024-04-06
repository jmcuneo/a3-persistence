## Calculator app

Connor Chartier - ctchartier@wpi.edu
My glitch url: http://a3-connorchartier.glitch.me

My application allows the user to add, subtract, multiply, and divide any two numbers. These numbers get stored in a database and can be retrieved based on the user who is signed in. The data stored in the database as well as deleted and edited

My login page is fully functional but sometimes the page does not immediately show the page, i was not able to figure out why. So immediatley when entering onto the calculator page, you can click the "sign out" button, it will bring you to the login page. If the user inputs a username and password that is unknown to the database, a new account is made. Any data will be stored with that new username and password. If user signs out and inputs an existing account, the user will be able to see the previous computations from associated with that username and password. 

Here is a sample user you can see previous results for:

username: user1
password: password1

I did not use OAuth, I used a seperate page, because i though it would be easiest to implement. I used the Bootstrap CSS framework because i did some reasearch and i found that it was multipurpose and easy to use. I applied it to both my index.html and my login.html. 

I made no modifications to the CSS package. My website achieves at least 90% in all 4 categories. Also I included the HTML elements for textarea, input and a checkbox. Though the checkbox and comments dont do anything. If i had more time i was going to have the remember me button save the user info so they did not have to login again but i was unable to due to the timing and scope of the project.

## Technical Achievements
- **Tech Achievement 1**: I did not use OAuth authentication via the GitHub strategy
- **Tech Achievement 2**: I did not host my website on another platform
- **Tech Achievement 3**: I did not get 100% in all categories

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...
- **Design Achievement 2**: Here is my description of my use of CRAP principles:
Contrast:
In my design, the high-contrast is strategically used to highlight important page elements. For instance, the clear blue color of the submit button helps contrasts against the vibrant orange background, ensuring its visibility to the user for future interaction. Similarly, I made the choice of black text color for headers against lighter backgrounds. This helps provide clear legible text compared to the surrounding content. This use of contrast not only adds to the the visual appeal of the index.html and login.html pages but also increases the navigation and readability of them. Using high contrast guides users' attention to key components helping to make the interaction with the interface clearer and more intuitive.

Repetition:
Consistency is important to consider when designing more than one web page. The design approach to index.html and login.html was a uniform styling applied across similar elements throughout the pages. For example, the border radius, padding, and border color maintain the same design attributes. This helps with consisenency and familiarity for users across both the index.html and login.html pages. The repetition of color palette and font choices helps make the user feel like the two pages are related een though they have different functionalities. This consistent repetition streamlines the user's experience.

Alignment:
I tried to include consisent alignment for an intuitive arrangement of elements in the pages' forms and sections. I aligned the input box labels with their corresponding input fields to ensure that users knew clearly, which inputs go with which text box. I also used text alignment. For example, centering headers or aligning them to the left helps to organize the page content in a clear and structured way so the user doesnt get confused. Alignment also supports the idea of a "visual hierarchy" which makes it easier for users to navigate, understand, and interact with the content in index.html and login.html the way that I as the programmer would expect them to.

Proximity:
I grouped HTML elements within forms, divs, and sections excersise proximity's role the index.html and login.html page designs. I tried to place labels and input fields in close proximity inside the login form. It helped relationships between the text fields and the input boxes for the user. It also helps them understand where to input what information. Also, proximity can help the user intereact with the program the way that i would expect. For example, if the text for an input box is way higher than the input box, the user might not associate that box with the information that I as a programmer would want them to put. This could break the program. 