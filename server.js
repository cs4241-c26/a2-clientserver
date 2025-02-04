const http = require( "node:http" ),
    fs   = require( "node:fs" ),
    mime = require( "mime" ),
    dir  = "public/",
    port = 3000

const appdata = [
    { "exercise": "Bench", "reps": 8, "weight": 225 },
    { "exercise": "Squat", "reps": 8, "weight": 405 },
    { "exercise": "Deadlift", "reps": 3, "weight": 550}
]

const calculate1rm = function( weight, reps ) {
    return Math.round( weight * ( 1 + ( reps / 30 ) ) )
}

const server = http.createServer( function( request,response ) {
    if( request.method === "GET" ) {
        handleGet( request, response )
    }
    else if ( request.method === "DELETE" ){
        handleDelete( request, response )
    }
    else if( request.method === "POST" ){
        handlePost( request, response )
    }
    else if( request.method === "PUT" ){
        handleUpdate( request, response )
    }
})

const handleGet = function( request, response ) {
    const filename = dir + request.url.slice( 1 )

    if( request.url === "/" ) {
        sendFile( response, "public/index.html" )
    }
    else if( request.url === "/getdata" ) {
        const responseData = appdata.map(item => ({
            ...item,
            projected_1rm: calculate1rm(item.weight, item.reps)
        }));
        response.writeHead( 200, "OK", {"Content-Type": "application/json" })
        response.end( JSON.stringify( responseData ) )
    }
    else{
        sendFile( response, filename )
    }
}

const handlePost = function(request, response) {
    let dataString = "";

    request.on("data", function(data) {
        dataString += data;
    });

    request.on("end", function() {
        try {
            const newEntry = JSON.parse(dataString);

            if (!newEntry.exercise || !newEntry.reps || !newEntry.weight) {
                response.writeHead(400, { "Content-Type": "text/plain" });
                return response.end("Error: Missing required fields (exercise, reps, weight)");
            }

            appdata.push(newEntry);

            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ message: "Data added successfully", data: newEntry }));

        } catch (error) {
            response.writeHead(400, { "Content-Type": "text/plain" });
            response.end("Error: Invalid JSON format");
        }
    });
};

const handleDelete = function(request, response) {
    let dataString = "";

    request.on("data", function(data) {
        dataString += data;
    });

    request.on("end", function() {
        try {
            const deleteEntry = JSON.parse(dataString);

            if (!deleteEntry.exercise) {
                response.writeHead(400, { "Content-Type": "text/plain" });
                return response.end("Error: Missing required field (exercise)");
            }

            const index = appdata.findIndex(item => item.exercise === deleteEntry.exercise);

            if (index !== -1) {
                appdata.splice(index, 1);
                response.writeHead(200, { "Content-Type": "application/json" });
                response.end(JSON.stringify({ message: "Data deleted successfully" }));
            } else {
                response.writeHead(404, { "Content-Type": "text/plain" });
                response.end("Error: Data not found");
            }

        } catch (error) {
            response.writeHead(400, { "Content-Type": "text/plain" });
            response.end("Error: Invalid JSON format");
        }
    });
}

const handleUpdate = function(request, response) {
    let dataString = "";

    request.on("data", function(data) {
        dataString += data;
    });

    request.on("end", function() {
        try {
            const updateEntry = JSON.parse(dataString);
            const index = appdata.findIndex(item => item.exercise === updateEntry.exercise);

            if (index !== -1) {
                appdata[index] = updateEntry;
                appdata[index].projected_1rm = calculate1rm(appdata[index].weight, appdata[index].reps);
                response.writeHead(200, { "Content-Type": "application/json" });
                response.end(JSON.stringify({ message: "Data updated successfully" }));
            } else {
                response.writeHead(404, { "Content-Type": "text/plain" });
                response.end("Error: Data not found");
            }
        } catch (error) {
            response.writeHead(400, { "Content-Type": "text/plain" });
            response.end("Error: Invalid JSON format");
        }
    });
};

const sendFile = function( response, filename ) {
    const type = mime.getType( filename )

    fs.readFile( filename, function( err, content ) {
        if( err === null ) {
            response.writeHeader( 200, { "Content-Type": type })
            response.end( content )
        } else {
            response.writeHeader( 404 )
            response.end( "404 Error: File Not Found" )
        }
    })
}

server.listen( process.env.PORT || port )