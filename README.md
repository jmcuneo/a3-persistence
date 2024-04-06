# TaskWave

TaskWave is simple to-do list application that allows users to create, edit, and delete tasks. Users can also mark tasks as complete or incomplete. Each user has their own account and can only see their own tasks. You can view it [here](https://taskwave.onrender.com/).

## Technologies Used

- **Bun**: A fast all-in-one JavaScript runtime used for server management.
- **Express**: Web framework for handling routing and middleware.
- **MongoDB**: NoSQL database used for storing data such as user profiles and tasks.

### Express Middleware

- **bcryptjs**: Securely hashes and salts passwords.
- **Chalk**: Enhances console output with colored text.
- **Cookie**-parser: Parses cookies attached to the client request headers.
- **dotenv**: Manages environment variables from a .env file.
- **jsonwebtoken**: Implements JSON Web Tokens for secure authentication.
- **mongoose**: MongoDB object modeling tool to manage data interactions.
- **uuid**: Generates unique identifiers for entities like tasks.


## Technical Achievements

- **(10 Points) User Authentication:** Users can create an account and log in which saves their tasks to their account in the database.
- **Bootstrap Styling:** The application is styled using Bootstrap for a clean and modern look.
- **(5 Points) Hosted on Render:** The application is hosted on Render for easy access and deployment.
- **(5 Points) 100% on Lighthouse Audit:** The application scores 100% on all Lighthouse audits for performance, accessibility, best practices, and SEO.

## Design Achievements

### 12 Tips used from W3C (10 Points)
1. **Informative Page Titles:** Each page (`index.html`, `login.html`, `register.html`) uses a specific and descriptive `<title>` that indicates its purpose, aiding users with screen readers to understand the page context.
2. **Headings to convey meaning and structure:** Each page uses headings (`<h1>`, `<h2>`) to convey the structure of the page and the importance of each section.
3. **Link text that clearly describes the link target:** All links on the page have descriptive text that indicates the target of the link, such as "Login" or "Register".
4. **Interactive elements are keyboard accessible:** Interactive form elements and buttons are styled with Bootstrap classes that offer a visually distinct and consistent appearance across all pages, facilitating easy identification.
5. **Clear Instructions:** The login and register pages have clear instructions on how to use the form and what information is required.
6. **Clear and Concise Content:** The content on each page is clear and concise, providing users with the necessary information without overwhelming them.
7. **Minimize Input Errors:** On the registration page, JavaScript is used to ensure passwords match before the form can be submitted, which helps prevent and correct mistakes
8. **Easy to use interactive elements:** The site uses standard, easily clickable buttons and input fields, enhancing usability for people with motor impairments.
9. **Easily identifiable feedback:** The application provides immediate feedback via alerts if passwords do not match or if there is a login error, aiding in clear communication of system states.
10. **Form Labels:** Each input field on the registration and login pages has a corresponding label that clearly describes the purpose of the field.
11. **Avoid Captchas:** The application does not use captchas, which can be difficult for users with visual impairments to complete.
12. **Designs for different screen sizes:** The application use of Bootstrap ensures that the site is responsive and accessible on various screen sizes, making it easier for users with different devices to access the site.

### CRAP Principles (10 Points)

#### Contrast
The most visually striking element on each page is the primary action button ("Add" on the `index.html` page and "Login"/"Register" on the respective forms), which uses a bold blue color (`btn-primary` from Bootstrap). This high contrast against the white background and lighter elements (e.g., input fields) draws immediate user attention, making it clear that these are the main actions users are expected to take.

#### Repetition
The design uses consistent colors, fonts, and button styles across all pages, which are standardized through the use of Bootstrap. This repetition helps unify the different pages under a single visual identity. The blue color for primary actions and red for critical actions (like the "Logout" button) is repeated throughout, reinforcing user familiarity and intuitive use.

#### Alignment
All elements within each page are centered using CSS Flexbox, which simplifies the layout and ensures that elements are visually balanced and easy to navigate. This center alignment, applied through the `d-flex` and `align-items-center` classes, ensures that content is strategically organized and aesthetically pleasing, providing a straightforward path for the user's eyes to follow.

#### Proximity
Related items are grouped together, enhancing the overall coherence of the user interface. For example, each task on the index page is listed with its associated actions (checkbox, delete button) closely placed. This grouping implies a relationship between these elements, making it easier for users to understand how to interact with them. On the login and registration pages, form fields are grouped in a compact, focused area, emphasizing their relationship and separating them distinctly from other navigational links.