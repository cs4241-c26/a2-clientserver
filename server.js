const http = require("http");
const fs = require("fs");
const url = require("url");
const mime = require("mime");
const dir = "public/";
const port = 3000;

let todos = [];
let nextId = 1;

function computeDeadline(creation_date, priority) {
  const creationDate = new Date(creation_date);
  let daysToAdd;
  if (priority == 1) {
    daysToAdd = 1;
  } else if (priority == 2) {
    daysToAdd = 3;
  } else if (priority == 3) {
    daysToAdd = 7;
  } else {
    daysToAdd = 5;
  }
  const deadlineDate = new Date(creationDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  return deadlineDate.toISOString().split("T")[0];
}

function sendFile(response, filename) {
  const type = mime.getType(filename);
  fs.readFile(filename, function(err, content) {
    if (err === null) {
      response.writeHead(200, { "Content-Type": type });
      response.end(content);
    } else {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("404 Error: File Not Found");
    }
  });
}

function handleGet(request, response) {
  const parsedUrl = url.parse(request.url, true);
  if (parsedUrl.pathname === "/") {
    sendFile(response, "public/index.html");
  } else if (parsedUrl.pathname === "/todos") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(todos));
  } else {
    sendFile(response, dir + parsedUrl.pathname.slice(1));
  }
}

function handlePost(request, response) {
  let dataString = "";
  request.on("data", function(chunk) {
    dataString += chunk;
  });
  request.on("end", function() {
    let data;
    try {
      data = JSON.parse(dataString);
    } catch (err) {
      response.writeHead(400, { "Content-Type": "text/plain" });
      response.end("Invalid JSON");
      return;
    }
    const parsedUrl = url.parse(request.url, true);
    if (parsedUrl.pathname === "/todos") {
      if (!data.task || !data.priority || !data.creation_date) {
        response.writeHead(400, { "Content-Type": "text/plain" });
        response.end("Missing required fields: task, priority, creation_date");
        return;
      }
      const deadline = computeDeadline(data.creation_date, data.priority);
      const newTodo = {
        id: nextId++,
        task: data.task,
        priority: data.priority,
        creation_date: data.creation_date,
        deadline: deadline
      };
      todos.push(newTodo);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(newTodo));
    } else {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("Not Found");
    }
  });
}

function handleEdit(request, response) {
    let dataString = "";
    request.on("data", function(chunk) {
      dataString += chunk;
    });
    request.on("end", function() {
      let data;
      try {
        data = JSON.parse(dataString);
      } catch (err) {
        response.writeHead(400, { "Content-Type": "text/plain" });
        response.end("Invalid JSON");
        return;
      }
      const parsedUrl = url.parse(request.url, true);
      if (parsedUrl.pathname === "/edit-todo") {
        if (!data.id || !data.task || !data.priority) {
          response.writeHead(400, { "Content-Type": "text/plain" });
          response.end("Missing required fields: id, task, priority");
          return;
        }
        // Convert the id to a number
        const id = Number(data.id);
        const index = todos.findIndex(todo => todo.id === id);
        if (index === -1) {
          response.writeHead(404, { "Content-Type": "text/plain" });
          response.end("Todo not found");
          return;
        }
        const todo = todos[index];
        todo.task = data.task;
        todo.priority = data.priority;
        todo.deadline = computeDeadline(todo.creation_date, data.priority);
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(todo));
      } else {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.end("Not Found");
      }
    });
  }  

function handleDelete(request, response) {
  const parsedUrl = url.parse(request.url, true);
  const id = Number(parsedUrl.query.id);
  if (!id) {
    response.writeHead(400, { "Content-Type": "text/plain" });
    response.end("Missing id parameter");
    return;
  }
  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1) {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("Todo not found");
    return;
  }
  todos.splice(index, 1);
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Todo deleted");
}

// Creates the HTTP server
const server = http.createServer(function(request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  } else if (request.method === "PUT") {
    handleEdit(request, response);
  } else if (request.method === "DELETE") {
    handleDelete(request, response);
  } else {
    response.writeHead(405, { "Content-Type": "text/plain" });
    response.end("Method Not Allowed");
  }
});

// Start the server
server.listen(process.env.PORT || port, () => {});