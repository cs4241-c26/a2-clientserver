# Todo List App

Glitch Link: https://github.com/mjrb7/a2-mjrb7

My application is a todo list app, it allows you to add, edit, mark, and delete tasks. You can add a priority and a category to each task as well as adding a custom deadline you want to complete the task by. It also has a filter that allows you to sort the tasks by category and the app uses a CSS Flexbox to keep all the components arranged and looking good on any screen size.

## Technical Achievements
- **Single page submitting and table updating**: My application is a single-page app where the form and table display are always in sync. You can submit a new task and it shows up in the table instantly which is updated from the server data. Also if you don't put your own custom deadline, it will add an auto-calculated deadline based on priority level (2 days for high, 5 for medium, 7 for low).

- **Editing data**: I also added the ability to edit/delete the data in the table by clicking the edit icon next to the delete icon. Once you click it, it will enter edit mdoe for that specific task and allow you to change the task and you can then save it by clicking the save icon which replaces the edit icon during the editing state or you can just hit enter. And to delete any task in the table you can just click the trash can icon in the row.
