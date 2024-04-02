## Ad-Hoc Time Entry System

Website Link: [https://ssgreene.tech/]()

I was inspired to rewrite A2 to have a more practical application - a Time Entry system. Since my senior year in high school, I have interned with a medical firm, Sheard & Drugge. Over time, I got rather lazy manually logging my hours in an excel spreadsheet. This solution is a much more effective and efficient solution to create hour logging.

The CSS framework used is Bootstrap, with no custom CSS styling used. I used this framework because Ive previously worked with it and had the most familiarity with it. The authentication strategy used is Github OAuth2 - because I wanted to achieve the technical achievement.

Middleware packages used:

1. PassportJS - for OAuth2 authentication with Github
2. express.json() - For parsing requests as JSON
3. Handlebars - A view renderer.
4. ensureAuthenticated - Custom middleware that access to the logging portions of the website have been preceded by authentication. If not, redirects to login via Github.
5. CORS - enables resource sharing. Recommended for stable connection to Mongo and other outside resources.

My challenges came mostly from trying to connect to Mongo. I was initially aiming to connect via Mongoose - the idea of using models/schemas sounded much more enjoyable than the loseness of strictly using the Mongo driver. However, this did not prevail and I ended up just using the Mongo driver. 

## Technical Achievements

- **Tech Achievement 1**: Implemented OAuth2 authentication via Github. The user's username in the database with that shift record, so that when shifts are inserted/retrieved they are only inserted/retrieved for that user.
- **Tech Achievement 2:** My website is hosted on a custom domain which points to a virtual machine provided by Oracle Cloud Infrastucture. Setting this up required me to manage the DNS records, create an NGINX reverse proxy on the VM, and update the firewall to allow the VM to act as a web server.
- **Tech Achievement 3**: [Lighthouse Report](https://pagespeed.web.dev/analysis/https-ssgreene-tech/ogh4qsa45m?form_factor=desktop) with 100% on all sectors.

### Design/Evaluation Achievements

- **Design Achievement 1**: Accessibility via the following:
  1. My website title accurately describes what you do on my website, with unique titles for login and entry pages.
  2. I have unique headings to convey meaning. I use a top level heading to convey the name of the system, Ad-Hoc Time Entry System, and sub headings to convey the unique sections of the page.
  3. I have a link to login with github that clearly conveys you are clicking to login with Github.
  4. I have no alt-text, but this is primarily because I dont have any images :(
  5. My instruction for adding a shift I think is very intuitive - as tested by users.
  6. The page is not bloated with content.
  7. The contrast is great and comes from a color panel (FlatUI)
  8. Color is not used to convey information any where in the design
  9. Every form control in submission of a shift and removal of a shift has a label.
  10. The page has a set language.
  11. Page uses aria-label and aria-describedby to enhance accessibility on sections.
  12. Form fields validate to help users from preventing mistakes by entering improper data, or data that would otherwise mess up the system.
