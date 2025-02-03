const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const mime = require("mime");
const port = 3000;

const exercises = []; // In-memory storage for exercise data

const server = http.createServer((request, response) => {
    const { method, url } = request;

    if (method === "GET") {
        if (url === "/") {
            sendFile(response, "public/index.html");
        } else if (url === "/data") {
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify(exercises));
        } else {
            sendFile(response, `public${url}`);
        }
    } else if (method === "POST" && url === "/add") {
        handlePost(request, response);
    } else if (method === "DELETE" && url.startsWith("/delete/")) {
        handleDelete(request, response, url);
    } else {
        response.writeHead(404);
        response.end("404 Not Found");
    }
});

const handlePost = (request, response) => {
    let dataString = "";

    request.on("data", (chunk) => {
        dataString += chunk;
    });

    request.on("end", () => {
        const data = JSON.parse(dataString);
        exercises.push(data);

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(exercises));
    });
};

const handleDelete = (request, response, url) => {
    const index = parseInt(url.split("/").pop());
    if (!isNaN(index) && index >= 0 && index < exercises.length) {
        exercises.splice(index, 1);
    }

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(exercises));
};

const handlePut = (request, response, url) => {
    const index = parseInt(url.split("/").pop());
    if (isNaN(index) || index < 0 || index >= exercises.length) {
        response.writeHead(400);
        response.end("Invalid index");
        return;
    }

    let dataString = "";

    request.on("data", (chunk) => {
        dataString += chunk;
    });

    request.on("end", () => {
        const updatedData = JSON.parse(dataString);
        exercises[index] = updatedData; // Update existing entry

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(exercises));
    });
};

server.on("request", (request, response) => {
    if (request.method === "PUT" && request.url.startsWith("/update/")) {
        handlePut(request, response, request.url);
    }
});


const sendFile = (response, filepath) => {
    const filePathWithDir = path.resolve(filepath);
    const type = mime.getType(filePathWithDir);

    fs.readFile(filePathWithDir, (err, content) => {
        if (err) {
            response.writeHead(404);
            response.end("404 File Not Found");
        } else {
            response.writeHead(200, { "Content-Type": type });
            response.end(content);
        }
    });
};

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
