# Assignment 2 - Personal Workout Tracker - Progress Check
**By: Vivek Reddy Kasireddy**

## Tips on how to use the application 
The user inputs their workouts -> Name, Time, Type (Strength, Cardio) and then any extra notes they have. 
The user would refresh the page to see that it has been added to log. 
The user can also edit a workout that is already added to the log and then click add exercise to see that that exercise has been updated. 

## Technical Achievements

### 1. Single-Page App with Live Data Updates
The goal of this feature was to transform the app into a single-page application (SPA) that dynamically updates the user interface without requiring a full page reload. This was achieved using JavaScript and the Fetch API or Axios for communication between the client and server.

The app was modified to dynamically display workout entries in a designated div on the homepage. The client-side logic was enhanced to send new workout data to the server using a POST request, and the server responds by returning the updated list of workouts. The client then updates the UI by fetching the new data and refreshing the workout log immediately.

This functionality was implemented by:
- Modifying the HTML structure to include a div for displaying entries.
- Updating the `main.js` script to send data to the server and refresh the UI.
- Ensuring that the server responds with the full updated dataset each time a new workout is added.

The server stores the workout entries either in an array or a database.

### 2. Modify Existing Data
To further improve the app's functionality, an "Edit" button was added next to each workout entry, allowing users to modify existing data rather than just adding new entries. This required the implementation of an additional endpoint in the server to handle update requests.

When the user clicks the "Edit" button, the app pre-fills the form with the existing workout data. Upon submitting the form, the app sends a PUT request to the server with the updated data, which replaces the original workout entry. The client then fetches the updated list of workouts to reflect the changes in the UI.

## Design / UX Achievements

### 1. User Testing with Think-Aloud Protocol
To evaluate the usability of the app, user testing was conducted with two classmates using the Think-Aloud Protocol. Each tester was given a task to perform, such as adding and editing a workout entry, without any instructions provided upfront. The goal was to observe the testers' behavior, identify any issues or confusion they encountered, and gather feedback for improving the user experience.

#### Problems Observed:
- Users were confused about the "Edit" button and didn’t realize they needed to click it before modifying a workout.
- Users had difficulty understanding how to save changes after editing.

#### Surprising Feedback:
- One tester suggested adding a confirmation message after editing, which was not initially considered.

#### Planned Improvements:
- Add a "Workout updated!" message after edits to confirm changes.
- Rename the "Edit" button to "Modify Workout" to make the functionality clearer.

These improvements aim to enhance the clarity of interactions and the overall user experience.
