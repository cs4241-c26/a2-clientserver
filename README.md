
https://glitch.com/edit/#!/a2-cpconsiglio?path=server.js%3A1%3A0

## Todo List Application
My project is a simple todo web app. It uses the server to store todos created by the user through a form on the home page. It's styled using flexbox positioning and has 2 pages - Home and View Todos. Home is where todos can be created using the todo form and View Todos is where saved todos can viewed in a table. From the View Todos page, previously saved todos can be edited or deleted.

## Technical Achievements
- **Edit Button**: I added an edit button on the View Todos table to allow users to edit a todo's task and priority. This is done using a PUT request to the server.
- **Immediate Server Feedback**: Upon submitting the todo form, it is checked whether the todo was successfully sent to the server. If so, the user is shown a confirmation message beneath the todo form explaining that their todo has been created and the computed deadline for the todo (using a simple deadline calculation done in the server based on the todo's priority)
