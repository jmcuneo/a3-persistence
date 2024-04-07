## Storm reports

https://éamonn.ie/a3/

dummy username: `dummy`
dummy password: `password`

This is a website which allows a registered user to submit reports regarding severe weather. Reports are sent to a database, and only the user (and the database's operator) can see the reports that they made. They can also modify and delete their reports.

Challenges I faced: Getting my chosen CSS template/framework to work well with my HTML design, I had to design my HTML to make much more use semantic tags than it did initially. Other challenges I faced invovled some technical achievements.

This website uses a username/password strategy for authentication. I wanted to go a little deeper than plaintext password storage (dangerous!) though, so I implemented password hashing, which I will discuss more in the technical achievements section.

At the login page users are asked to login with a username and password. If they enter the wrong password they will be sent back to the login screen. If they enter the correct username/password combo they can visit the main page. New accoutns are created when a nonexistent username is entered into the login screen. There are no password restrictions.

I used the Tacit CSS framework, a very simple framework relying entirely on semantic HTML tags to do it's styling. I chose it because I very much like it's simplicity in both use and design; I don't particularly like the flashy features that people like to implement in their websites, so it worked very well. I made some modifications to the CSS, adding borders and a fixed layout to the table, and rearranging my form with a CSS grid.

Packages used:

- **Express** - Core express middleware - express.json() for json handling and express.urlencoded() to easily use html forms.
- **MongoDB** - Used to interact with MongoDB database.
- **Cookie-Session** - Used to store session data in cookies. Used for login bool and username string. (Perhaps the login bool is redundant...)
- **bcrypt** - Used to hash passwords with bcrypt.
- **dotenv** - Used to allow the server to get it's own environmental variables from a .env file.

![Screenshot of the login Page](/loginpage.png)
*The website's login page*

![Screenshot of reporting page](/reportpage.png)
*The website's reporting/viewing page*

## Reccomended Technical Achievements
- **Tech Achievement 1**: Hosted website on my own VPS. I already had a VPS for my personal website with DigitalOcean. 

Using the VPS I configured nginx to act as a reverse proxy for NodeJS. I encountered quite a few difficulties with this due to how this changed relative directories, and pages would not load correctly. To fix this I had to make modifications to my nginx configuration as well to the clientside HTML (changing requests from /submit to /a3/submit, etc.)

In order to deal with any unexpected crashes or server restarts, I used [pm2](https://www.npmjs.com/package/pm2) to automatically restart the node server.

In addition to https://éamonn.ie/a3/, this website can be visited as an onionsite through TOR at: http://eamonndcqorwwlb23qd7jtdsptjyfedr3fn2poaw6oouaysdovojauyd.onion/a3/

- **Tech Achievement 2**: 100% on all lighthouse tests. While I was always at 100% for the Performance and Best practice tests, the accessibility tests and SEO tests required some work. I added some labels to my forms to fix the accessiblity isues (as well as something else that I can't quite remember). For the SEO test I added a meta description, made sure that the robots.txt file was accessible, and added a viewport tag for better scaling.

## "Custom" Technical Achievements
- **Tech Achievement 3** (Either 5 or 10 points - not as hard as Oauth, but still a challenge) - Password hasing - While I chose not to add oauth functionality, I still wanted a better way to do passwords. In order to make sure that passwords would be safe in the event of a breach, I added password hasing using bcrypt and a salt. 

Using the bcrpyt package, new user accounts have their passwords hashed and salted. The hash/salt combination is stored in the database, and reversed using the salt when a user logs in. I encountered some difficulty in getting it to work properly at first due to my unfamiliarity with the bcrypt node package (a lot of undefined and blank hashes), but after some tweaking I was able to get it to work properly.

- **Tech Achievement 4** (5 points - tedious task) - Use of own SSL certificate + onionsite configuation - While most "plug and play" hosting providers will provide their own SSL certificate, my decision to use my own VPS meant that I would have to generate my own SSL cert if I wanted to secure the connection between my server and any clients (which is important for passwords!)

I used certbot and Let's Encrypt to generate SSL certificates for my websites. This was a relatively simple process and added my own SSL certificate to my nginx configuration after giving the authority a few pieces of information. I then setup a cronjob to automatically renew the certificate.

I did not need an SSL certificate for the onionsite (as all internal TOR traffic is already encrypted), but it is still a tedious task to set up. I first had to download the ubuntu TOR package (on my server) in order to get connected. Then with some configuration, I was able to get it working with nginx to start delivering my webiste. After that, I ran a program `mkp224o` on my local machine to generate a vanity TOR address for my site (so it can start with "eamonn", and uploaded the private key onto my server and replaced the autogenerated tor one. This required some modification of the nginx file again, but just to change the public TOR address.
