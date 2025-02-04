const http = require("node:http"),
    fs = require("node:fs"),
    mime = require("mime"),
    dir = "public/",
    port = 3000;

const appdata = [];

const server = http.createServer(function (request, response) {
    if (request.method === "GET") {
        handleGet(request, response);
    } else if (request.method === "POST") {
        handlePost(request, response);
    } else if (request.method === "DELETE") {
        handleDelete(request, response);
    } else if (request.method === "PUT") {
        handlePut(request, response);
    }
});

const handleGet = function (request, response) {
    const filename = dir + request.url.slice(1);

    console.log("[GET]", request.url);

    if (request.url === "/") {
        sendFile(response, "public/index.html");
    } else if (request.url === "/movies") {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(appdata));
    } else {
        sendFile(response, filename);
    }
};

const handlePost = function (request, response) {
    let dataString = "";

    request.on("data", function (data) {
        dataString += data;
    });

    request.on("end", function () {
        let json = JSON.parse(dataString);
        console.log("[POST]", json);
        json["commitment"] = json["duration"] < 90 ? "Low" : json["duration"] > 150 ? "High" : "Medium";
        appdata.push(json);
        console.log("(APPDATA Updated)", appdata);

        response.writeHead(200, "OK", { "Content-Type": "application/json" });
        response.end(JSON.stringify(appdata));
    });
};

const handleDelete = function (request, response) {
    let dataString = "";

    request.on("data", function (data) {
        dataString += data;
    });

    request.on("end", function () {
        let json = JSON.parse(dataString);
        const index = appdata.findIndex(movie => movie.title === json.title);
        if (index !== -1) {
            appdata.splice(index, 1);
        }

        console.log("[DELETE]", json);
        console.log("(APPDATA Updated)", appdata);

        response.writeHead(200, "OK", { "Content-Type": "application/json" });
        response.end(JSON.stringify(appdata));
    });
};

const handlePut = function (request, response) {
    let dataString = "";

    request.on("data", function (data) {
        dataString += data;
    });

    request.on("end", function () {
        let json = JSON.parse(dataString);
        const index = appdata.findIndex(movie => movie.title === json.oldTitle);
        if (index !== -1) {
            appdata[index] = {
                title: json.title,
                genre: json.genre,
                duration: json.duration,
                priority: json.priority,
                commitment: json.duration < 90 ? "Low" : json.duration > 150 ? "High" : "Medium"
            };
        }

        console.log("[PUT]", json);
        console.log("(APPDATA Updated)", appdata);

        response.writeHead(200, "OK", { "Content-Type": "application/json" });
        response.end(JSON.stringify(appdata));
    });
};

const sendFile = function (response, filename) {
    const type = mime.getType(filename);

    fs.readFile(filename, function (err, content) {
        if (err === null) {
            response.writeHeader(200, { "Content-Type": type });
            response.end(content);
        } else {
            response.writeHeader(404);
            response.end("404 Error: File Not Found");
        }
    });
};

server.listen(process.env.PORT || port);
console.log("Listening on port " + port);