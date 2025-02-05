# Anime Rating System

A dynamic web application that allows users to manage and rate anime entries. The application uses CSS Flexbox for layout positioning, particularly in the form groups and main container structure. The system calculates a popularity score based on the rating and number of episodes, providing users with a derived metric for each anime entry.

Glitch Link: https://a2-adequatej.glitch.me/

### Instructions
1. Add new anime entries using the form at the top of the page
2. View all entries in the table below
3. Edit existing entries by clicking the "Edit" button
4. Delete entries using the "Delete" button
5. The popularity score is automatically calculated based on rating and episode count

## Technical Achievements

### Achievement 1: Single Page Application with Real-time Updates
- Created a single-page application that allows users to add, edit, and delete anime entries without refreshing the page
- The server sends back updated data after each operation, and the client updates the display automatically using the fetch API

### Achievement 2: Data Modification Functionality
- Implemented the ability to edit existing anime entries
- The edit button fills the form with the current data, allowing users to update entries easily
- The form changes between "Add" and "Update" modes, and the popularity score is recalculated after modifications

## Design/Evaluation Achievements

### User Testing Feedback

I conducted user testing with two classmates to evaluate the usability of the Anime Rating System. The task given to each person was to add a new anime entry, edit an existing entry, and then delete an entry, all within 10 minutes.

#### Participant 1: Daniel Stoiber
- Daniel found the edit functionality slightly confusing at first because the form did not clearly indicate when it was in "edit mode."
- He also mentioned that the color scheme was very appealing and made the interface feel professional.
- Based on his feedback I could add a visual indicator or message to the form when it is in edit mode to make it clearer to users.

#### Participant 2: Bryan Suria
- Bryan mentioned that the "Add Anime" button was a bit big and could be made smaller to look more neat.
- He also noted that he liked the hover effects on the table rows, stating it made the interface feel more interactive.
- Based on his feedback, I could decrease the button size and also add a shadow hover effect like the other buttons. 



