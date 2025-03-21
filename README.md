Assignment 2 - Client Server: Basic Two-tier Web Application using HTML/CSS/JS and Node.js
===

Due: 

This assignment will introduce you to creating a prototype two-tiered, client-server web application.
Your application will include the use of HTML, CSS, JavaScript, and Node.js functionality, with active communication between the client and the server.

Baseline Requirements
---

There are a range of application areas and possibilities that meet these baseline requirements.
Try to make your application do something useful! A todo list, storing / retrieving high scores for a very simple game... have a little fun with it.

Your application is required to implement the following functionalities:

- a `Server` which not only serves files, but also maintains a tabular dataset with 3 or more fields related to your application
- a `Results` functionality which shows the entire dataset residing in the *server's memory*, i.e. the data resides as objects in the server code.
- a `Form/Entry` functionality which allows a user to add or delete data items residing in the server's memory
- a `Server Logic` which, upon receiving new or modified "incoming" data, includes and uses a function that adds at least one additional derived field to this incoming data before integrating it with the existing dataset
- the `Derived field` for a new row of data must be computed based on fields already existing in the row.
  For example, a `todo` dataset with `task`, `priority`, and `creation_date` may generate a new field `deadline` by looking at `creation_date` and `priority`

Your application is required to demonstrate the use of the following concepts:

HTML (4 pts each, total of 16 pts):
- One or more [HTML Forms](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms), with any combination of form tags appropriate for the user input portion of the application
- A results page displaying all data currently available on the server. You will most likely use a `<table>` tag for this, but `<ul>` or `<ol>` could also work and might be simpler to work with. Alternatively, you can create a single-page app (see Technical Achievements) but this is not a requirement.
- All pages should [validate](https://validator.w3.org)
- If your app contains multiple pages, they should all be accessible from the homepage (index.html)

CSS (4 pts each, total of 16 pts):
- CSS styling of the primary visual elements in the application
- Various CSS Selector functionality must be demonstrated:
    - Element selectors
    - ID selectors
    - Class selectors
- CSS positioning and styling of the primary visual elements in the application:
    - Use of either a CSS grid or flexbox for layout
    - Rules defining fonts for all text used; be deliberate! Be sure to use a web safe font or a font from a web service like [Google Fonts](http://fonts.google.com/)
- CSS defined in a maintainable, readable form, in external stylesheets

Client-Side JavaScript (12 pts):
- At minimum, a small amount of front-end JavaScript to get / fetch data from the server; a sample is provided in this repository.

Server-Side Node.js (16 pts):
- An HTTP Server that delivers all necessary files and data for the application, and also creates the required Derived Fields in your data.
  A starting point is provided in this repository.

Deliverables
---

Do the following to complete this assignment and achieve a base grade of 85%:

1. (5 pts) Accept this A2 assignment have Git Classroom generate your private repository. This repo contains some starter code that may be used or discarded as needed.
2. (60 pts - see above) Implement your project with the above requirements.
3. Test your project to make sure that when someone goes to your main page, it displays correctly.
4. (5 pts) Temporarily make your GitHub repo public, deploy your project to Glitch, and fill in the appropriate fields in your package.json file. Make your repo private again!
5. (5 pts) Ensure that your project has the proper naming scheme `a2-yourGithubUsername` so we can find it.
6. (5 pts) Modify the README to the specifications below, and delete all of the instructions originally found in this README.
7. (5 pts) Push your final version of your local repository to your GitHub repo before the deadline.

Achievements
---

Below are suggested technical and design achievements. You can use these to help boost your grade up to an A and customize the assignment to your personal interests. These are recommended achievements, but feel free to create/implement your own... just make sure you thoroughly describe what you did in your README and why it was challenging. ALL ACHIEVEMENTS MUST BE DESCRIBED IN YOUR README IN ORDER TO GET CREDIT FOR THEM. Remember, the highest grade you can get on any individual assignment is a 100%.

*Technical*
- (5 points) Create a single-page app that both provides a form for users to submit data and always shows the current state of the server-side data. To put it another way, when the user submits data, the server should respond sending back the updated data (including the derived field calculated on the server) and the client should then update its data display.

- (5 points) In addition to a form enabling adding and deleting data on the server, also add the ability to modify existing data.

*Design/UX*
- (5 points per person, with a max of 10 points) Test your user interface with other students in the class. Define a specific task for them to complete (ideally something short that takes <10 minutes), and then use the [think-aloud protocol](https://en.wikipedia.org/wiki/Think_aloud_protocol) to obtain feedback on your design (talk-aloud is also fine). Important considerations when designing your study:

1. Make sure you start the study by clearly stating the task that you expect your user to accomplish.
2. You shouldn't provide any verbal instructions on how to use your interface / accomplish the task you give them. Make sure that your interface is clear enough that users can figure it out without any instruction, or provide text instructions from within the interface itself.
3. If users get stuck to the point where they give up, you can then provide instruction so that the study can continue, but make sure to discuss this in your README. You won't lose any points for this... all feedback is good feedback!

You'll need to use some type of collaborative software like Zoom that will enable you both to see the test subject's screen and listen to their voice as they describe their thoughts, or conduct the studies in person. After completing each study, briefly (one to two sentences for each question) address the following in your README:

1. Provide the last name of each student you conduct the evaluation with.
2. What problems did the user have with your design?
3. What comments did they make that surprised you?
4. What would you change about the interface based on their feedback?

*You do not need to actually make changes based on their feedback*. This achievement is designed to help gain experience testing user interfaces. If you run two user studies, you should answer two sets of questions.

Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

## Your Web Application Title
Include a very brief summary of your project here. Be sure to include the CSS positioning technique you used, and any required instructions to use your application.

## Technical Achievements
- **Tech Achievement 1**: Using a combination of...

### Design/Evaluation Achievements
- **Design Achievement 1**: 
