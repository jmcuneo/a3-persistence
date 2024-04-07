
* libraries used
  * jsonwebtoken  
    * authentication, once a user authorizes they get a cookie and pass it in all subsiquent requests. Once it expires the user is kicked back to the login page.
  * mongodb
    * Mongo Client
      * used for basic connections
    * serverapiversion
      * used to be precise about the communication protocol
    * GridfsBucket
      * unfortunately I could not get photo uploads working. the way I setup my frontend was messy and given time I would rewrite it to give it better functionality
      * so its not used but there is code that depends on it but isn't used
  * Bodyparser 
    * used to parse text from the client's request
  * path
    * used for some image code I left in because i just wanted to include the effort
    * it is used to store things on the server temporarily
  * env
    * used to manage the various secrets associated with such a project

* **Design Description**
  
  

Technical Acheivements 
  1. Perfect score in every lighthouse catagory. On all 3 Pages