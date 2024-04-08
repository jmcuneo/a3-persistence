## Workout Log
https://a3-ryannguyen-b8aec8d81c80.herokuapp.com/

Account For Testing:
- User: admin
- Password: admin

The application is a workout log. The user can log their workouts adding a title and a description for every workout. A user can then edit a workout and delete them.

When creaeting the application a large challenge I faced was creating the Express server. The main problem was that my client side was sending the information correctly, and my server side was obtaining it, however I was performing actions on the server before ALL my data was received on the server, meaning a majority of the time my application was inconsistent. 

For authentication I locally stored the clients UUID. Whenever information was needed or to be posted from a user, their UUID along with whatever kind of request they wanted was sent so that the server knew which user was interacting with the system.

For CSS I used Bootstrap. I found it largely different than vanilla CSS and the way I used it as it was mostly class based. For example setting the height or width of an object might be a class such as **h-5 or w-10**. This was somewhat annoying as a lot of my elements had the same styling so when I created my style sheet many classes were used by different elements. Meaning I had to individually style elements with bootstrap.

Express MiddleWare
- Used mongoose to interact with MongoDB. create models and schema.
- UUID as unique identifiers for users and posts.


## Technical Achievements
- **Tech Achievement 1**: Utilized heroku webhosting.
  - Much easier to setup and navitage than glitch. Similar to glitch heroku has the ability to deploy any site from a github repo and brach. However it also has live deployment, so any change made on github or the repo is automatically reflected on the site. Along with this you can see network trafic, logs, and speed tests.
- **Tech Achievement 2**: 100% On Lighthouse Testing.
  - https://photos.app.goo.gl/5t1WSEtEbo3bQSmj7
  - https://photos.app.goo.gl/zFrJgpEPgWfJMLvE6

### Design/Evaluation Achievements
- **Design Achievement 1**: CRAP Principles

Contrast:
In my application, the principle of contrast was effectively used to enhance user experience and readability. For instance, contrasting colors were utilized to differentiate between various sections and elements within the app. This helped users easily distinguish between different workout categories, such as cardio, strength training, and flexibility exercises. But also helped users find similarities between functions in the application. For example most buttons have a dark color schema with lighter colored text, by following the same design principles throughout the application for all buttons users gain a better understanding of the application as they can associate a design with function. Additionally, contrasting text styles and sizes were used to highlight important information, such as workout goals and textual input areas, making them more prominent and easily readable against the background. By utilizing contrast in this way, the application not only improved visually but the flow of the program improved ,allowing users to quickly and efficiently log their workouts and monitor their progress. The application of the contrast principle contributes significantly to the overall usability and effectiveness of the application.


Repetition:
In the application, the principle of repetition was used to create a cohesive and simple user experience. Consistent design elements, such as uniform fonts, colors, and icons, were repeated throughout the app's interface, establishing  consistent visuals. This repetition helped users navigate the app more intuitively. For example, the same color scheme was consistently used across different sections, making it easier for users to associate specific colors with certain functions. Additionally, repetitive layouts and structures were employed for logging workouts,viewing workouts, and tracking progress. Another example is the sidebar in my application. Every element in the sidebar is consistent with size, color and functionality. Each item has a function tied with a click event. By staying consistent, the application promotes ease of use, and fosters a more engaging user experience, ultimately enhancing the overall effectiveness and appeal of the application.


Alignment:
In the application, the principle of alignment was applied to create a clean, organized, and visually appealing interface. All elements, such as text boxes, buttons, and images, were aligned with precision to maintain a consistent layout. This strategic alignment ensured that elements had a logical flow from one section to another, naturally guiding users.. For instance, creating, viewing and editing workouts, were neatly aligned to create in the sidebar for a clear visual hierarchy, making it easier for users to locate and interact with the information they need. Additionally important elements such as user inputs and viewing large amounts of information were aligned in the center of the screen to visually show the importance of what is being displayed. By utilizing proper alignment, the application is enhanced overall aesthetically but also improves in usability.

Proximity:
In the application, the principle of proximity was effectively utilized to enhance visual clarity, application organization, and user engagement. Firstly, related elements with similar purposes  and information were grouped closely together, creating visual clusters. For example nearly all user functionality was located on the left hand side of the screen on the side bar. The ability to view, create and edit workouts are all clustered on the left hand side of the scream to reduce the navigation effort needed for a user to complete certain actions. The strategic placement of these clusters makes the application more intuitive for users thus overall improving the user experience. Additionally, the use of proximity in the application's design contributes to a cleaner and more organized layout, enhancing readability and usability.


