const http = require("node:http"),
  fs = require("node:fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you're testing this on your local machine.
  // However, Glitch will install it automatically by looking in your package.json
  // file.
  mime = require("mime"),
  dir = "public/",
  port = 3000;

const tododata = [
  {
    task: "Buy groceries",
    priority: "High",
    creation_date: "2025-02-03",
    due_date: "2025-02-04",
  },
  {
    task: "Finish project report",
    priority: "Medium",
    creation_date: "2025-02-02",
    due_date: "2025-02-05",
  },
  {
    task: "Call plumber",
    priority: "Low",
    creation_date: "2025-02-01",
    due_date: "2025-02-08",
  },
  {
    task: "Workout",
    priority: "High",
    creation_date: "2025-02-03",
    due_date: "2025-02-04",
  },
  {
    task: "Read 10 pages of a book",
    priority: "Medium",
    creation_date: "2025-02-02",
    due_date: "2025-02-05",
  },
];

// let fullURL = ""
const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  } else if (request.method === "DELETE") {
    handleDelete(request, response);
  }

  // The following shows the requests being sent to the server
  // fullURL = `http://${request.headers.host}${request.url}`
  // console.log( fullURL );
});

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/todos") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(tododata));
  } else {
    sendFile(response, filename);
  }
};

const handlePost = function (request, response) {
  if (request.url === "/todos") {
    let dataString = "";

    request.on("data", function (data) {
      dataString += data;
    });

    request.on("end", function () {
      try {
        const newTodo = JSON.parse(dataString);
        // caclulate the due date (derived field)
        const dueDate = calculateDueDate(
          newTodo.creation_date,
          newTodo.priority
        );
        newTodo.due_date = dueDate;

        // Add the new todo to the tododata array
        tododata.push(newTodo);

        console.log("New todo added:", newTodo);

        // Only send the response once after the todo is added
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(newTodo)); // Respond with the new todo
      } catch (error) {
        console.error("Error processing POST data:", error);
        response.writeHead(400, { "Content-Type": "text/plain" });
        response.end("Invalid JSON data");
      }
    });
  } else {
    // Handle other routes if necessary
    response.writeHead(404);
    response.end("Not Found");
  }
};

const handleDelete = function (request, response) {
  const taskToDelete = request.url.split("/")[2].replace("%20", " "); // Extract the task name from the URL
  const todoIndex = tododata.findIndex((todo) => todo.task === taskToDelete);

  if (todoIndex > -1) {
    tododata.splice(todoIndex, 1); // Remove the todo item
    console.log("Todo deleted:", taskToDelete);
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Todo deleted successfully");
  } else {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("Todo not found");
  }
};

function calculateDueDate(creationDate, priority) {
  // Convert the creation date string to a Date object
  const date = new Date(creationDate);

  // Number of days to add based on priority
  let daysToAdd;
  if (priority === "High") {
    daysToAdd = 1;
  } else if (priority === "Medium") {
    daysToAdd = 3;
  } else if (priority === "Low") {
    daysToAdd = 7;
  } else {
    throw new Error("Invalid priority value");
  }

  // Add the days to the creation date
  date.setUTCDate(date.getUTCDate() + daysToAdd); // Use setUTCDate to handle UTC time zone

  // Format the date as 'YYYY-MM-DD'
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Add 1 because months are 0-indexed
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    // if the error = null, then we've loaded the file successfully
    if (err === null) {
      // status code: https://httpstatuses.com
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      // file not found, error code 404
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

// process.env.PORT references the port that Glitch uses
// the following line will either use the Glitch port or one that we provided
server.listen(process.env.PORT || port);
