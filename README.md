## Powerlifting Database V2

Bryon Tom: https://a3-bryontom.glitch.me/

The goal of the application is to create a database to store powerlifting results for a single person. Because one person can maintain different results and different meets, 
it makes sense for there to be different entries. One can fill out all the labels on the left in order to submit an entry. To delete an entry, only the ID of the entry to delete is required, while updating required an ID as well as new info in the left column to be fileld out.
The biggest difficulty I had was figuring out my connection to MongoDB. The guide on GitHub didn't work for me, so I ended up having to look through the MongoDB website for more assistance.
I chose to implement OAuth because I heard it was what a lot of websites currently use, so I figured it would be relevant.
I used [this](https://html5up.net/uploads/demos/editorial/elements.html) CSS framework, copying in the .CSS file.
I used express-session and axios.
Express-session helps to access the session associated with the requests that have been made.
Axios facilitates requests to first or third party servers in order to fetch data (in this case, github)

## Technical Achievements

- **Github OAuth**: I used axios to facilitate sending HTTP requests in order to authenticate using GitHub. This was difficult because I had to look into documentation for unfamiliar packages, and had to debug and figure how to operate this process.

### Design/Evaluation Achievements

- **Accessibility**: I had clearly formatted website titles, as well as headings to describe each portion of the page. The README features clear instructions, with content through kept as concise as possible.
- To align with Google Lighthous, I picked out colors that featured sufficient constrast. The buttons are clearly buttons, with the elements in each form each having a clear label. 
- Effort was made to create an intuitive form layout.
- 

- **CRAP Principles**: I followed the following tips from the W3C Web Accessibility Initiative:
- *C*: I chose a clearly distinctive color in order to ensure that elements on my screen were able to be clearly scene and recognized. The buttons and text boxes all had their own distinct shape, ensuring that the interactable portions of the web page were easily discernable. The headings of each web page were also made to be much bigger, ensuring that the user is able to clearly discern and understand the purpose of each page in the application. The database itself is clearly formatted, with spacing to ensure that each category in the table has enough space to not clutter the screen. I have also made efforts to cut down on a lot of the unneccesary visual elements that I had considered adding earlier, as they wouldn't really contribute to the purpose of the website.
- *R*: Because I went for a minimalist scheme, with no images and little visual flair, I did not have a lot of visual ideas to repeat throughout my application. However, I used the same colour scheme for each webpage, keeping a consistent identity for my application. My buttons were all of the same style, with my input boxes also having the same schemes in order to keep the form nice and cohesive. Additionally, the headings on each of the web pages were kept the same, with the sizing and proportions being exact matches, preserving some sense of unity within the website as a whole. The CSS template also had nicely complementary fonts, meaning that my headers, forms, lists, and tables all shared the same font scheme.
- *A*: The headers on each page had the font centered on the screen. The login button was also centered, resulting in a nicely symmetrical home page. The actual database had two columns of inputs, with each column having the labels for the input centered over the actual input box. The left column is centered with the submit button, while the right column has the update and delete buttons next to each other. I originally debated moving the elements in the right column down to be vertically centered, but I ended up deciding against it, as I liked the look of everything being aligned at the top of the page better. Each element in the table itself is also aligned, creating a nicely formatted results table for the user.
- *P*: There isn't too much to say for proximity in my website, as there aren't a lot of elements to actually space out. Regradless, I tried to be concious of how close the elements were to oen another, and spaced them out. For example, I didn't want the login button to be in the middle of a blank page, so I positioned it at the top with some padding between it and the heading. On the second page, there was more content to actually fill out. Once again, I maintained a similar distance from the heading to the forms, with the labels and buttons also spaced out. I added some padding underneath the columns in order to maintain some distance from the form to the results table.