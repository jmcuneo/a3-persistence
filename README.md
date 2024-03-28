# Car Data Application

Link:
https://a3-hanzalahqamar.vercel.app

Reload the page a few times and try logging in a few times if you encounter errors.
Sometimes the Vercel page bugs and shows a internal server error because no one has accessed it in a long time and the database connection timed out. Just let Vercel warm up.

Either log in through github or create a new account by entering a new unique username and any password, and it will create a new account for that username. 

add cars with the correct parameters into the table, you can edit them by clicking on the fields after they are added into the table and editing them, then pressing update

# Car Data Application Summary

## Application Goal
The goal is to provide a user-friendly platform for managing car data and conducting surveys on car preferences. Features include adding, viewing, updating, and deleting car information, participating in car surveys, viewing submitted survey data, and user authentication using local and GitHub OAuth strategies.

**Login Page:**
![Login Page](<Screenshot 2024-03-28 at 1.44.37 AM.png>)

**App Page:**
![App Page](<Screenshot 2024-03-28 at 1.45.32 AM.png>)


## Challenges Faced
Challenges included implementing authentication with Passport.js, validating user input, designing a user-friendly interface with Tacit CSS, integrating MongoDB for data storage, and managing survey form logic.
Deploying to vercel also required lots of debugging, such as making sure the database connection didnt time out and the deployment could never access it again, and also helping the app recognize the github oauth properly.

## Authentication Strategy
Two strategies were used: LocalStrategy for username/password login and GitHubStrategy for OAuth with GitHub. This approach provides both traditional and modern login options to accommodate different user preferences.

## CSS Framework and Customizations
The Tacit CSS Framework was used for its minimalistic and classless design. Custom CSS modifications were made for specific layout requirements, such as setting the display style for the 'Intro' field in the survey form.

## Middleware Used
- `express.static`: Serves static files such as HTML, images, and CSS from a specified directory.
- `express.json()`: Parses incoming request payloads as JSON, facilitating the handling of JSON content from client-side applications.
- `express.urlencoded({ extended: false })`: Parses incoming requests with URL-encoded payloads, typically from HTML forms.
- `express-session`: Manages user sessions across web requests, enabling persistent state between browsing sessions.
- `passport`: Provides authentication middleware capable of using different strategies like username/password authentication or OAuth with services like GitHub.
- Custom Cache-Control Middleware: Modifies the `Cache-Control` header for all responses to `no-store`, preventing browsers from caching sensitive user data.


# Technical Achievements
**Tech Achievement 1**: I used OAuth authentication for the login via the GitHub strategy.

**Tech Achievement 2**: Hosted on Vercel: 
I think that vercel was very simple and straightforward to deploy on
A few good things about vercel:
- It automatically redeploys the app whenever the github is pushed to, so you dont need to manually redeploy after every change you push to github
- You dont need to manually create an env file in the vercel deployment, it just asks you to paste the env contents into a form when you first deploy, and it takes care of everything else for you
- Github Oauth worked flawlessly because the link for the page stays the same each deployment.

A few inconveniences:
- Minor changes to the package.json have to be made.
- Vercel.json needs to be created and populated with the correct input before deploying the app to make sure it runs properly.

    Youtube Tutorial to host using Vercel:
https://www.youtube.com/watch?v=vCuf62T2snY


 **Tech Achievement 3**:
Got 100% on all four lighthouse tests for both the login and app page.
Note that it needs to be run in incognito because extensions interfere with the performance test.


# Design/Evaluation Achievements

- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative:

**Tips for Writing:**

1. Provide informative, unique page titles: Each HTML page has a unique and descriptive title element that succinctly describes the content and purpose of the page (e.g., "Login" and "Car Data").

2. Use headings to convey meaning and structure: HTML headings (h1, h2, etc.) are used to structure content hierarchically, making it easier for screen readers to navigate the page.

3. Write meaningful link text: All links have descriptive text that provides context for the link's destination, such as "Logout" and "Sign in with GitHub," rather than generic text like "click here."

**Tips for Designing:**

4. Ensure sufficient color contrast: The color scheme of the site has been chosen to ensure sufficient contrast between text and background colors, improving readability for users with visual impairments.

5. Don't use color alone to convey information: In addition to color, other visual indicators (such as text labels) are used to convey information, ensuring that the content is accessible to users who may have difficulty distinguishing colors.

6. Ensure that interactive elements are easy to identify: Interactive elements such as buttons and form fields are styled to be visually distinct and easily identifiable.

**Tips for Developing**:

7. Ensure keyboard control for all functionality: All interactive elements on the site can be accessed and used via a keyboard, ensuring accessibility for users who cannot use a mouse.

8. Use ARIA roles and properties appropriately: ARIA (Accessible Rich Internet Applications) roles and properties are used to enhance the accessibility of dynamic content and complex user interface components.

9. Ensure that form elements include clearly associated labels: All form elements have associated label elements with a for attribute that matches the id of the corresponding input, ensuring that screen readers can accurately announce the form fields.

10. Provide clear feedback for user interactions: Visual and/or textual feedback is provided for user interactions, such as form submissions and button clicks, to confirm the action taken.

11. Test and validate accessibility: Accessibility testing has been conducted using tools such as WAVE (Web Accessibility Evaluation Tool) to identify and address any accessibility issues.

12. Use semantic HTML: Semantic HTML elements (such as header, nav, main, footer) are used to convey the structure and purpose of the content, enhancing accessibility for screen reader users.


- **Design Achievement 2**: How my site includes the four CRAP principles

Contrast:
The most emphasized element on each page of my site is the main header, "Car Data" and "Login," which has been given a larger font size and bold weight to stand out prominently. This creates a strong contrast with the rest of the content, immediately drawing the user's attention to the purpose of the page. Additionally, I used a different color for the "Logout" and "Sign in with GitHub" links to differentiate them from regular text and emphasize their importance as interactive elements. The contrast principle is further applied in the form tables and buttons, where I used distinct colors to highlight actionable items, ensuring they are easily identifiable and accessible to users. This approach helps in maintaining a clear visual hierarchy and aids in user navigation.

Repetition:
Throughout the site, I maintained consistency in design elements to create a cohesive and visually appealing experience. The use of the Tacit CSS framework ensures that the fonts, colors, and button styles are consistent across all pages. The same font family is used for both headers and body text, creating a harmonious look and feel. The color scheme is kept minimal, with a primary color for headers and buttons and a secondary color for links, providing a clear visual hierarchy. The layout of forms and tables is also repeated on different pages, making it easy for users to navigate and interact with the site, as they become familiar with the consistent structure and design. This repetition of elements reinforces the brand identity and creates a sense of familiarity for the user.

Alignment:
To organize information and enhance readability, I used alignment strategically throughout the site. Text and form fields are left-aligned, creating a clean and organized layout that guides the user's eye through the content logically. Buttons are aligned with the corresponding input fields, providing a clear visual connection between actions and their related inputs. In the navigation header, the user information and logout link are right-aligned, creating a visual balance with the page title on the left. This alignment not only organizes the information but also increases contrast for particular elements, making the site more visually appealing and user-friendly. Proper alignment is crucial for creating a structured and professional-looking interface.

Proximity:
Proximity is used on the site to group related items and create a clear visual structure. In the forms, labels are placed close to their respective input fields, indicating their association and making it easy for users to understand what information is required. The survey form groups related questions together, such as the radio buttons for "Favorite Body Style," enhancing the user's ability to quickly comprehend the options. Similarly, the table displaying car data keeps related information, such as model and year, close to each other, facilitating quick scanning and comprehension. By using proximity to organize visual information, the site provides a logical and intuitive user experience. This principle is essential for creating a user-friendly layout that minimizes confusion and enhances the overall usability of the site.

