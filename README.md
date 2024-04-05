## Inventory Manager

https://a3-persistence-ycvb.onrender.com/

This project is a simple inventory manager like you would see in a video game. The user clicks items in the resource pool to move them in/out of the inventory. Users can add items to the item pool by typing an object name and it will be displayed in the pool. Valid icons can be found here: https://fontawesome.com/icons. Most things are center justified on this page, but grids were used to organize the items inside the inventory and item pool

Some challenges I encountered were ordering my modules when importing them. I did not realize the order mattered, so I enocuntered errors that I did not know how to solve for a while.

I chose to use passport to do github OAuth. I chose this because the graders have github and passport was recommended in the README.

I used the NES.CSS framework, because my game is inspired by video games. I made custom inventory slots in my own CSS file. I also clamped some of the values so that they shrunk with the page if the user's device was not wide enough. In addition to this, I styled a custom dark-mode with high contrast to be more accessible to users. The grid layouts had to be a custom layout as well.

The resource pool persists for every user. They all share the same pool. The number of inventory slots and the items in the slots is saved on a per-user basis. The user can add to the resource pool by typing in an item name and the add button. The user can change the number of inventory slots by pressing the radio buttons. The buttons on the items can be pressed to move items to/from the inventory.

## Technical Achievements
- **Tech Achievement 1**: I implemented the OAauth authentication via the github strategy with passport.js. If a new user is detected, it will register a new account in the database and also alert the user.

-Each user has their own session to allow numerous users to use the site at the same time, without interfering with eachothers data

-The site uses cookies to keep the user logged in for the day.

-I hosted my website using render instead of glitch. I liked that the site updates when I update my github. I miss being able to directly make edits in glitch though, which helped with designing the front-end.

-I received 100% on all lighthouse scores for all pages

![Capture](https://github.com/jjcaissie/a3-jaysoncaissie/assets/132401971/c6442284-2cff-4c44-8c4a-a3b2c8bb3b5d)

![Capture2](https://github.com/jjcaissie/a3-jaysoncaissie/assets/132401971/6d5dfc6c-a478-4bd2-bd62-10e88ce9c384)

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...

- 1. Provide informative, unique page titles
	My program consists of two page, both of which have descriptive titles 
		Login Page - Inventory Manager 	
		Inventory Manager

2. Use headings to convey meaning and structure
	Each section has a heading to clearly show what is in the following section
 ![image](https://github.com/jjcaissie/a3-jaysoncaissie/assets/132401971/15088401-8b2e-4103-81a5-1969c0a5a459)

3. Make link text meaningful
	The following text is descriptive of what the action does
	 ![image](https://github.com/jjcaissie/a3-jaysoncaissie/assets/132401971/655b1781-5b10-48a7-a570-88895064049a)

4. Provide sufficient contrast between foreground and background. 
	Each element is in white while the background is in black. The contrast is incredibly high. The logout button is blue, as it is a little less important than the rest

5. Ensure that interactive elements are easy to identify
	When hovering over non-interactive elements, the cursor is default. When hovering over a button, it switches to a custom-click cursor. When it hovers over text, it changes to the I icon. When hovering over non-interactive elements, the cursor does not change. The icons also have proper styling for when something is focused to ensure that users who use keyboard navigation know which element is in focus. This shows users what is interactable and what is not. There was one error in my page I could not figure out in time and that is that the “checked” radio button has an extra tabindex

6. Help users avoid and correct mistakes
	I have built-in alerts for when certain actions cannot be taken. If an action can be taken, visible changes to the page are made.
  ![image](https://github.com/jjcaissie/a3-jaysoncaissie/assets/132401971/b66e8c39-96df-4df3-aabf-eb86ea2c001b)
![image](https://github.com/jjcaissie/a3-jaysoncaissie/assets/132401971/97a9b151-5eb7-40de-989e-f694ea6908f4)
![image](https://github.com/jjcaissie/a3-jaysoncaissie/assets/132401971/2404f786-2b66-4fe0-a551-28097a861bd2)
 
7. Use headings and spacing to group related content
	Each container has a margin to show that the content inside them clearly belongs to a certain section. They also have clear headings to group them too
 ![image](https://github.com/jjcaissie/a3-jaysoncaissie/assets/132401971/1f52be11-6181-491a-a8e2-4f1c8349bb14)

8. Write code that adapts to the user’s technology
The elements get resized/rearranged when the viewport width changes.
![image](https://github.com/jjcaissie/a3-jaysoncaissie/assets/132401971/25afe9b3-2262-4043-a4d0-445a85fa64a5)
![image](https://github.com/jjcaissie/a3-jaysoncaissie/assets/132401971/559606d3-038d-4379-b318-23dd3016a246)

9. Ensure that all interactive elements are keyboard accessible
	Users can navigate the entire page using tab and by inputting text with a keyboard

10. Identify page language and language changes
	Every page specifies the language is in English 
  ![image](https://github.com/jjcaissie/a3-jaysoncaissie/assets/132401971/4f7c5b34-dd80-412c-a752-f9c9b9dec586)
![image](https://github.com/jjcaissie/a3-jaysoncaissie/assets/132401971/289c9636-de3e-4e3b-b63e-1999c484dc74)

11. Provide clear instructions
	I have instructions for the user to understand how to use each section. I also specify what datatype(integer) to use when entering a value/weight for an object
 ![image](https://github.com/jjcaissie/a3-jaysoncaissie/assets/132401971/e6f6fe5a-3c26-48eb-958c-8fb8f152b711)
![image](https://github.com/jjcaissie/a3-jaysoncaissie/assets/132401971/b9d23e40-ff77-42bd-bd1b-8227f0a735d2)
![image](https://github.com/jjcaissie/a3-jaysoncaissie/assets/132401971/d41ea1a4-4616-49de-9a46-e6cb054f26ed)
 
12. Provide easily identifiable feedback
	This can be seen in numerous areas. When a new user is created, an alert is shown to communicate to the user that their account was successfully registered. When data is successfully put into the database, the backend data is shown to the user at the bottom of the page. There are also alerts for when operations fail, and there is feedback for the user to help correct their mistakes. 

I used CRAP principles to organize my pages

The C stands for contrast. I demonstrate sufficient contrast in color in my program by making the background black and making sure the color of the elements is different enough to make them pop and be visible to the user. The inventory elements are the most important elements, so I make them a different color from all the other elements to draw attention to these. Contrast does not have to be exclusively color; I also use contrasting font sizes to differentiate kinds of elements. Headers are larger than all the other text elements to ensure readers read these first to know what each section of the page is before diving into that content. The inventory slots are also a slightly different style which helps draw attention to them and make it obvious that they are empty slots that items can go in.
The R stands for repetition. I utilize repetition to make the document more cohesive and unified. One of the things that reoccurs is the square containers that envelope different sections of the page. Each one has a border with the same style. The headers are also all centered atop the border, which helps the user identify that they are titles for their respective containers. The same font is also used throughout the entirety of the page. The font is similar to that of old games, which gives it a playful vibe and helps it feel more like a game and less like a tool. All elements, besides the custom inventory slots, are styled by the NES.css framework. All of the elements in this are already pre-styled to look great and cohesive together, and this was a huge help in making my site maintain a professional looking design aesthetic.
The A stands for alignment. The main containers in the page are aligned vertically so the page reads top to bottom naturally. This is an intentional decision, as tasks that should be completed first are near the top, and tasks that the users interact with later are near the bottom. All the sides of the containers are also aligned using the same margins. All the headers are also aligned in the center to keep things organized. Diving deeper into some of the containers, grids are utilized to keep things consistent. These grids are aligned horizontally. The resource pool and inventory both use dynamically sized grids to store arbitrary amounts of items. Elements that are aligned horizontally are related. They are either part of the same step(add/mod/delete), or they are grouped(in an array) in the database.
The P stands for proximity. Related items are grouped together. For example, all the form items are placed at the top in the same contained area. This makes it clear that these items are related. Once the user types an input, the nearby buttons placed directly below are the next logical step. Next, the instructions for any container are placed directly beneath the header every time. This pattern makes it clear to the user that they can find help right beneath the header. All related items are also placed in boxed containers. When the backend data is revealed, all the data is grouped at the bottom, since it is all related, but not interactable. The most interactable items are placed in the center of the screen, with slightly less interactable elements located above and beneath.
