Assignment 2 - Short Stack: Basic Two-tier Web Application using HTML/CSS/JS and Node.js
## Basic Course Tracker
Glitch link: https://a2-avstoyanov.glitch.me <br>
I made this website to act as a rough draft of the more advanced major tracker that my group will be working on for the final project. 
I used mostly Flexbox for positioning.
Instructions: 
* Input the full course code (prefix + number) in the first box, course name in the second and the number of credits it is worth in the third.
* Submit will push the new course to the server, clear will wipe all course data.
* The edit button on the right of the server data table entries will allow you to enter that entry. This includes:
  * Changing the prefix, number, name, or credits
  * Deleting the entry

## Technical Achievements
- **Tech Achievement 1**: Using a combination of server-side HTML API functions and client-side rendering, The app is a single-page app.
- **Tech Achievement 2**: The data table gets queried on refresh
- **Tech Achievement 3**: The edit button changes into three new buttons in-place, allowing for in-place modification and deletion of server data.
  - This one was much more difficult to figure out than I would have liked...
- **Tech Achievement 4**: The entire body of the table is dynamically generated using JS
- **Tech Achievement 5**: The table entries are numbered dynamically, and they all get updated upon in-place deletions to maintain order

### Design/Evaluation Achievements
- **Design Achievement 1**: Implemented a lot of CSS styling including nth-child styling for the dynamically generated table.
- **Design Achievement 2**: Simple but effective design using subtle colors, good contrast, and small improvements like the gradient and button color on hover.
- **Design Achievement 3**: Utilized space efficiently by combining 3 buttons into 1 when editing server data
- **Design Achievement 4**: Made the table scroll and the name be a text area so you can even write essays in it if you want... or things like "Tools And Techniques In Computer Network Security"
- **Design Achievement 5**: Made the input prompt not move up when adding courses :)
