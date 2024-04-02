Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
====================================================================================================

Check out the [CS 4241 Guides](https://github.com/jmcuneo/cs4241-guides) for help with the technologies discussed in this assignment.

This assignnment continues where we left off, extending it to use the most popular Node.js server framework (express),
a database (mongodb), and a CSS application framework / template of your choice (Boostrap, Material Design, Semantic UI, Pure etc.)

Baseline Requirements
---------------------


General:

- Your site should achieve at least 90% on the `Performance`, `Best Practices`, `Accessibility`, and `SEO` tests
  using Google [Lighthouse](https://developers.google.com/web/tools/lighthouse) (don't worry about the PWA test, and don't worry about scores for mobile devices).
  Test early and often so that fixing problems doesn't lead to suffering at the end of the assignment.

Deliverables
------------

Do the following to complete this assignment:

Acheivements
------------

Below are suggested technical and design achievements. You can use these to help boost your grade up to an A and customize the
assignment to your personal interests, for a maximum twenty additional points and a maximum grade of a 100%.
These are recommended acheivements, but feel free to create/implement your own... just make sure you thoroughly describe what you did in your README,
why it was challenging, and how many points you think the achievement should be worth.
ALL ACHIEVEMENTS MUST BE DESCRIBED IN YOUR README IN ORDER TO GET CREDIT FOR THEM.

*Technical*

- (10 points) Implement OAuth authentication, perhaps with a library like [passport.js](http://www.passportjs.org/).
  *You must either use Github authenticaion or provide a username/password to access a dummy account*.
  Course staff cannot be expected, for example, to have a personal Facebook, Google, or Twitter account to use when grading this assignment.
  Please contact the course staff if you have any questions about this. THIS IS THE HARDEST ACHEIVEMENT OFFERED IN WEBWARE. You have been warned!
- (5 points) Instead of Glitch, host your site on a different service. Find a service that is reputable and has a free tier. Post your findings on Slack in the #assignment3 channel. DO NOT feel compelled to purchase a paid tier from any service, although if you already have one, you are welcome to use it. Make sure to describe this a bit in your README. What was better about using the service you chose as compared to Glitch? What (if anything) was worse?
- (5 points) Get 100% (not 98%, not 99%, but 100%) in all four lighthouse tests required for this assignment.

*Design/UX*

- (10 points) Make your site accessible using the [resources and hints available from the W3C](https://www.w3.org/WAI/), Implement/follow twelve tips from their [tips for writing](https://www.w3.org/WAI/tips/writing/), [tips for designing](https://www.w3.org/WAI/tips/designing/), and [tips for development](https://www.w3.org/WAI/tips/developing/). *Note that all twelve must require active work on your part*.
  For example, even though your page will most likely not have a captcha, you don't get this as one of your twelve tips to follow because you're effectively
  getting it "for free" without having to actively change anything about your site.
  Contact the course staff if you have any questions about what qualifies and doesn't qualify in this regard.
  List each tip that you followed and describe what you did to follow it in your site.
- (5 points) Describe how your site uses the CRAP principles in the Non-Designer's Design Book readings.
  Which element received the most emphasis (contrast) on each page?
  How did you use proximity to organize the visual information on your page?
  What design elements (colors, fonts, layouts, etc.) did you use repeatedly throughout your site?
  How did you use alignment to organize information and/or increase contrast for particular elements.
  Write a paragraph of at least 125 words *for each of four principles* (four paragraphs, 500 words in total).

FAQ
---

**Q: Am I required modify my A2 submission for this assignment?**

No. If you want to start fresh for A3, you are welcome to do so. The option to start with A2 is simply there as a convenience for you.

**Q: Which CSS framework should I use? How do I use it?**

This is for you to figure out. While we do require Express and MongoDB for this assignment, we do not require a specific CSS framework, so we are not going to be discussing a specific one. You will be responsible for choosing a CSS framework and learning how to use it.

**Q: How do I keep my .env file out of my git repo?**

Create a .gitignore file on your local machine and list your .env file in it. Note that while your .env file should NOT appear in your repo, you will still want to add it to your Glitch project so that your website runs successfully.

**Q: I'm confused about how user accounts work for this assignment.**

For the base requirements (discounting the achievements), it should follow this logic:

1. If the user logs in and the account does not exist, create the account and inform the user the account has been created.
2. If the user logs in and the account exists but the password is incorrect, inform the user.
3. If the user logs in, the account exists, and the password is correct, then take the user to the page that shows the data specific to the user.

Note that implementing some of the technical achievements may override this requirement, which is fine.

Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
----------------------------------------------------------------------------------------------------------------------

## Ad-Hoc Time Entry System

Website Link: [https://ssgreene.tech/]()

I was inspired to rewrite A2 to have a more practical application - a Time Entry system. Since my senior year in high school, I have interned with a medical firm, Sheard & Drugge. Over time, I got rather lazy manually logging my hours in an excel spreadsheet. This solution is a much more effective and efficient solution to create hour logging.

The CSS framework used is Bootstrap, with no custom CSS styling used. I used this framework because Ive previously worked with it and had the most familiarity with it. The authentication strategy used is Github OAuth2 - because I wanted to achieve the technical achievement.

- challenges you faced in realizing the application
- the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please
  add a little more detail about what it does.

## Technical Achievements

- **Tech Achievement 1**: Implemented OAuth2 authentication via Github. The user's username in the database with that shift record, so that when shifts are inserted/retrieved they are only inserted/retrieved for that user.

### Design/Evaluation Achievements

- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...
