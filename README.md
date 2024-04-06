## String Combiner

https://a3-jacobsilvester.glitch.me/

I'm not sure if any login information is required, so I made an admin account. It's admin/admin to login.
Also I couldnt get messages to display for login errors, so it may just redirect you to the login page on a fail and when a new account is made


The application itself is very basic. It will prompt the user to login. There is a cluster dedicated to account creation and authentication. The page will check to see if a username in the database matches
if it doesn't a new account is formed. If it does but the password is wrong, it will fail the login. If the username and password match then the login is complete. 
Once in the main page, the user can see their strings, string lengths, edit, and delete at will. The logout page will end their session. The way I handled the data is definitely not optimal, the cluster stores the username
alongside each dataentry. It will only display those entries whose username matches. It just seemed simple to implement, even if its not secure
The CSS frame work I chose is Beer CSS. I chose it because it was funny. Not really anything more than that. It looks pretty nice too as a bonus.
The express packages I used were really just all the standard ones. I used the cookies to create sessions for tracking authentication. I had render imported, but ended up not using it.
There's a url encoder, which is used in the body parser to read the urls.




## Technical Achievements
- **Tech Achievement 1**: N/A

### Design/Evaluation Achievements
- **Design Achievement 1**: I think I could have gotten 100% on the lighthouse test. But my login page has a weird error preventing it from being full marks. Something about a robots.txt file. 
I wanted to be able to fix it, but I honestly could not understand what it wants from me.
