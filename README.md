# Movie Watchlist
My web application is a movie watchlist tracker. It would be used to keep track of movies the user is planning on watching. The user inputs the title, genre, duration, and priority (how badly they want to see the movie). When they add the movie to the watchlist, a field called "commitment" is derived from the movie's duration. Movies shorter than 90 minutes fall are low commitment, movies in the 90 to 150 minute range are medium commitment, and movies longer than 150 minutes are high commitment. This is meant to represent how much of a time commitment the user would be making, should they choose to watch.

## Technical Achievements
- **Single-page app**: Through the use of a modal, this is a single-page application. To add a new movie to the watchlist, the user clicks the "Add movie" button in the header and inputs the information into the pop-up window. When the user adds a movie to the list, the modal closes to show the table of movies.
- **Edit existing data**: The user can delete or edit data in the watchlist by clicking one of the buttons located on each row. When the edit button is clicked, the modal is opened pre-filled with the data associated with that movie.

## Design/Evaluation Achievements
### Evaluations:
- **Ari Schechter**
  - Problems: When there are no movies, the table is not present (no headers, etc.).
  - Comments: Liked the modal as a method of data entry.
  - What I would change: I would make it so the headers of the table are always shown, even when there is nothing in the table, or I would add a short message explaining how to get started.
- **James Walden**
  - Problems: Unclear what "commitment" means, had to be explained.
  - Comments: Suggested adding colors to the "priority" and "commitment" columns to make the data easier to digest.
  - What I would change: I would change the styling of those two columns to make them into tags, where the background behind the text is a color (green, yellow, red) depending on if the value was low, medium, or high.