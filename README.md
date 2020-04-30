# Project One -- HoneyDew

## MVP
HoneyDew is a platform for creating and editing a virtual representation of one's home.  When the user registers, a default space named "Home" is created. While logged in, the user can add any number of spaces and assign tasks to them.  There is an option to upload an image to each task.  The spaces can have a one-to-many association, as spaces can be created as children of existing spaces.  The tasks as well are one-to-many, as multiple tasks can be assigned to a given space and traded between them.  Finally, all spaces and associated tasks are likewise associated with the given user.
The user can also customize their profile page and add an image.

---

## User Stories
As a user, HoneyDew helps me break my to-do list down by the space within the home that each item is tied to.  I can have overarching tasks that are applied to the home in general, or specific tasks that belong to a given space or even subspace (e.g. closet, pantry).  I can give the tasks a check off my tasks as I complete them, and toggle between displaying all tasks and only those tasks that remain to be completed.
My HoneyDew page is my house's online presence.

---

## Stretch Goals

As we expand on the website, we would like to add the ability to see other users and their spaces, and add a "features" property to spaces.  Furthermore, we would give the site a social element, allowing users to communicate and add comments to one another's spaces.  Another goal would be to expand the user's ability to customize their experience, adding color schemes such as dark mode or monochrome.


## Technologies, Dependencies
The app is built using Javascript and Mongo DB, and requires the following dependencies: 
bcryptjs, Body Parser, Cloudinary, connect-mongo, datauri, dotenv, ejs, express, express-session, express-validator, Method Override, Mongoose, Multer


### Materials
[Collaboration Guide](https://git.generalassemb.ly/SF-SEI-10/Github-collaboration-guide)