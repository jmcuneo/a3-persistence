Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

- (10 points) Use of a [CSS framework or template](https://github.com/troxler/awesome-css-frameworks). This should do the bulk of your styling/CSS for you and be appropriate to your application.
  For example, don't use [NES.css](https://nostalgic-css.github.io/NES.css/) (which is awesome!) unless you're creating a game or some type of retro 80s site.

Your application is required to demonstrate the use of the following concepts:

HTML:
- (5 points) HTML input tags and form fields of various flavors (`<textarea>`, `<input>`, checkboxes, radio buttons, etc.)
- HTML that can display all data *for a particular authenticated user*. Note that this is different from the last assignnment, which required the display of all data in memory on the server.


CSS:
- CSS styling should primarily be provided by your chosen template/framework.
  Oftentimes a great deal of care has been put into designing CSS templates;
  don't override their stylesheets unless you are extremely confident in your graphic design capabilities.
  The idea is to use CSS templates that give you a professional looking design aesthetic without requiring you to be a graphic designer yourself.

General:
- (10 points) Your site should achieve at least 90% on the `Performance`, `Best Practices`, `Accessibility`, and `SEO` tests
  using Google [Lighthouse](https://developers.google.com/web/tools/lighthouse) (don't worry about the PWA test, and don't worry about scores for mobile devices).
  Test early and often so that fixing problems doesn't lead to suffering at the end of the assignment.

Deliverables
---

Do the following to complete this assignment:

1. Implement your project with the above requirements. I'd begin by converting your A2 assignment. First, change the server to use express. Then, modify the server to use mongodb instead of storing data locally. Last but not least, implement user accounts and login. User accounts and login is often the hardest part of this assignment, so budget your time accordingly.
2. If you developed your project locally, deploy your project to Glitch (unless completing the alternative server technical acheivement described below), and fill in the appropriate fields in your package.json file.
3. Test your project to make sure that when someone goes to your main page on Glitch (or an alternative server), it displays correctly.
4. Ensure that your project has the proper naming scheme `a3-FirstnameLastname` so we can find it.
5. Fork this repository and modify the README to the specifications below.
6. Create and submit a Pull Request to the original repo. Name the pull request using the following template: `a3-FirstnameLastname`.

Acheivements
---





*Technical*

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


**Q: Does "HTML input tags and form fields of various flavors" mean that we need to use multiple different kinds of inputs, or does it mean that we just need to use some form of input?**

You should have at least two different input types for this assignment. The purpose is to show your understanding beyond the simple `input` type you saw in A2.

**Q: Am I allowed to use other libraries/frameworks/etc. in this assignment?**

Yes, so long as those are IN ADDITION TO Express, MongoDB, and a CSS framework of your choice. Describe in your README any additional libraries or frameworks you used for this assignment. Also remember that the staff might not be familiar with these, so we may be unable to help you if you run into technical problems.


Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

## Powerlifting Database V2

Bryon Tom: https://a3-bryontom.glitch.me/

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of the application
- challenges you faced in realizing the application
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
- what CSS framework you used and why
    - include any modifications to the CSS framework you made via custom CSS you authored
- the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please
  add a little more detail about what it does.

## Technical Achievements
- **Github OAuth**: I used axios to facilitate sending HTTP requests in order to authenticate using GitHub. This was difficult because I had to look into documentation for unfamiliar packages, and had to debug and figure how to operate a frankly frustrating process.


### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...