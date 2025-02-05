const http = require("node:http");
const fs = require("node:fs");
const mime = require("mime");

const dir = "public/";
const port = 3000;

const appdata = [];

const getIndex = (url) => parseInt(url.split("/").pop());

const sendJSON = (response, status, data) => {
    response.writeHead(status, { "Content-Type": "application/json" });
    response.end(JSON.stringify(data));
};

const sendText = (response, status, text) => {
    response.writeHead(status, { "Content-Type": "text/plain" });
    response.end(text);
};

const server = http.createServer((request, response) => {
    const { method, url } = request;

    switch (method) {
        case "GET":
            url === "/courses" ? handleGetCourses(response) : handleGet(request, response);
            break;
        case "POST":
            handlePost(request, response);
            break;
        case "PUT":
            handlePut(request, response, getIndex(url));
            break;
        case "DELETE":
            if (url === "/clear") {
                handleDelete(response);
            } else if (url.startsWith("/delete/")) {
                handleIndividualDelete(response, getIndex(url));
            }
            break;
        default:
            sendText(response, 405, "Method Not Allowed");
    }
});

const handlePut = (request, response, index) => {
    collectData(request, (dataString) => {
        try {
            let updatedCourse = JSON.parse(dataString);

            if (!updatedCourse.cPrefix || !updatedCourse.cCode || !updatedCourse.cName || !updatedCourse.cCredits) {
                return sendText(response, 400, "Missing cPrefix, cCode, cName, or cCredits");
            }

            if (index >= 0 && index < appdata.length) {
                updatedCourse.cNumber = appdata[index].cNumber;
                appdata[index] = updatedCourse;

                sendJSON(response, 200, appdata);
            } else {
                sendText(response, 400, "Invalid index");
            }
        } catch (err) {
            sendText(response, 500, `Server error: ${err.message}`);
        }
    });
};


const handleIndividualDelete = (response, index) => {
    if (index >= 0 && index < appdata.length) {
        appdata.splice(index, 1);
        updateCourseNumbers();

        sendJSON(response, 200, appdata);
    } else {
        sendText(response, 400, "Invalid index");
    }
};


const handleGet = (request, response) => {
    const filename = dir + request.url.slice(1);

    if (request.url === "/") {
        sendFile(response, "public/index.html");
    } else {
        sendFile(response, filename);
    }
};

// Get all courses
const handleGetCourses = (response) => {
    sendJSON(response, 200, appdata);
};


const handlePost = (request, response) => {
    collectData(request, (dataString) => {
        try {
            console.log(dataString);
            let { cCode, cName, cCredits } = JSON.parse(dataString);

            if (!cCode || !cName || !cCredits) {
                return sendText(response, 400, "Missing cCode, cName, or cCredits");
            }

            // extract prefix
            const firstDigitIndex = cCode.search(/\d/);
            const cPrefix = cCode.slice(0, firstDigitIndex).toUpperCase().trim();
            cCode = cCode.slice(firstDigitIndex).trim();

            const cNumber = appdata.length + 1;

            const newCourse = {
                cNumber,
                cPrefix,
                cCode,
                cName,
                cCredits,
            };

            appdata.push(newCourse);
            console.log(appdata);

            sendJSON(response, 200, appdata);
        } catch (err) {
            sendText(response, 400, `Invalid JSON data: ${err.message}`);
        }
    });
};


const handleDelete = (response) => {
    appdata.length = 0; // clear all data
    sendText(response, 200, "Data cleared");
};


const sendFile = (response, filename) => {
    const type = mime.getType(filename);

    fs.readFile(filename, (err, content) => {
        if (err) {
            response.writeHead(404);
            response.end("404 Error: File Not Found");
        } else {
            response.writeHead(200, { "Content-Type": type });
            response.end(content);
        }
    });
};

// Helper to collect POST/PUT data. Needed some inspiration for this one
const collectData = (request, callback) => {
    let dataString = "";
    request.on("data", (chunk) => (dataString += chunk));
    request.on("end", () => callback(dataString));
};

// Update course numbers sequentially after modifications
const updateCourseNumbers = () => {
    appdata.forEach((course, i) => {
        course.cNumber = i + 1;
    });
};

server.listen(process.env.PORT || port, () => {
    console.log(`Server is running on port ${port}`);
});