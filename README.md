# Kitchen Inventory Manager (KIM)

This site has been deployed on [glitch](https://dear-cuboid-rake.glitch.me/)!

This is a simple webpage to help manage perishable goods in your kitchen. You enter the name of the good, the quantity, when it was purchased, and the type of good.
The server has a basic lookup table for how long types of goods tend to last, and marks items safe or not safe to eat accordingly.

To add a new item, fill out the fields at the bottom of the table. Click the trash can to delete an item. Positioning was accomplished with
centered divs.

## Technical Achievements
- **Single Page**: The application is a single page that can handle viewing, adding, and deleting data, using a programatically populated table and no reloading is required.

Note: requires crypto (builtin to nodejs) for UUID generation

### Design/Evaluation Achievements
- Evaluated UI/UX with Student Voleti
- The user did not encounter any issues accomplishing tasks; doing so quickly and efficiently
- User suggested that visual design should be improved, specifically colors to improve contrast and readability
- Based on feedback, I would make the color of the red (unsafe) entries lighter red and a lighter shade of green for the main background to improve contrast with the black text.