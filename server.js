const http = require( "node:http" ),
    fs   = require( "node:fs" ),
    mime = require( "mime" ),
    dir  = "public/",
    port = 3000

const tasks = []
let previous_id = -1

class Task {
    constructor(taskName, priority, dueDate) {
        this.id = previous_id + 1
        previous_id++
        this.taskName = taskName;
        this.priority = priority;
        this.dueDate = dueDate;
        this.overdue = new Date() - new Date(dueDate) > 86400000
    }
}

const findListIndex = function(taskID) {
    let listIndex = -1
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === taskID) {
            listIndex = i
        }
    }
    return listIndex
}

// let fullURL = ""
const server = http.createServer( function( request,response ) {
    if (request.method === "GET") {
        handleGet(request, response)
    }
    else if (request.method === "POST") {
        handlePost(request, response)
    }
    else if (request.method === "DELETE") {
        handleDelete(request, response)
    }
    else if (request.method === "PUT") {
        handlePut(request, response)
    }
})

const handleGet = function(request, response) {
    const filename = dir + request.url.slice(1)

    if (request.url === "/") {
        sendFile(response, "public/index.html")
    }
    else if (request.url === "/data") {
        response.writeHead(200, {"Content-Type": "application/json"})
        response.end(JSON.stringify(tasks))
    }
    else {
        sendFile(response, filename)
    }
}

const handlePost = function(request, response) {
    let dataString = ""

    request.on("data", function(data) {
        dataString += data
    })

    request.on("end", function() {
        const newTaskStr = JSON.parse(dataString)
        const newTask = new Task(newTaskStr.taskName, newTaskStr.priority, newTaskStr.dueDate)
        tasks.push(newTask)
        response.writeHead(200, "OK", {"Content-Type": "application/json"})
        response.end(JSON.stringify(tasks))
        console.log(newTask)
    })
}

const handleDelete = function(request, response) {
    let dataString = ""

    request.on("data", function(data) {
        dataString += data
    })

    request.on("end", function() {
        const deleteTaskID = parseInt(JSON.parse(dataString).id)
        const listIndex = findListIndex(deleteTaskID)

        if (listIndex !== -1) {
            tasks.splice(listIndex, 1)
            console.log("Deleted task with ID " + deleteTaskID)
        }
        else {
            console.log("Task with ID " + deleteTaskID + " was not found.")
        }

        response.writeHead(200, "OK", {"Content-Type": "application/json"})
        response.end(JSON.stringify(tasks))
    })
}

const handlePut = function(request, response) {
    let dataString = ""

    request.on("data", function(data) {
        dataString += data
    })

    request.on("end", function() {
        const taskStr = JSON.parse(dataString)
        const taskListIndex = findListIndex(taskStr.id)
        if (taskListIndex !== -1) {
            const task = tasks[taskListIndex]
            task.taskName = taskStr.taskName
            task.priority = taskStr.priority
            task.dueDate = taskStr.dueDate
            task.overdue = new Date() - new Date(task.dueDate) > 86400000
            console.log("Edited task with ID " + taskStr.id)
        }
        else {
            console.log("Task with ID " + taskStr.id + " was not found.")
        }

        response.writeHead(200, "OK", {"Content-Type": "application/json"})
        response.end(JSON.stringify(tasks))
    })
}

const sendFile = function( response, filename ) {
    const type = mime.getType( filename )

    fs.readFile( filename, function( err, content ) {

        // if the error = null, then we've loaded the file successfully
        if (err === null) {
            // status code: https://httpstatuses.com
            response.writeHeader( 200, { "Content-Type": type })
            response.end( content )
        }
        else {
            // file not found, error code 404
            response.writeHeader( 404 )
            response.end( "404 Error: File Not Found" )
        }
    })
}

// process.env.PORT references the port that Glitch uses
// the following line will either use the Glitch port or one that we provided
server.listen(process.env.PORT || port )

