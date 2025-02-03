const http = require( "node:http" ),
    fs   = require( "node:fs" ),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library if you're testing this on your local machine.
    // However, Glitch will install it automatically by looking in your package.json
    // file.
    mime = require( "mime" ),
    dir  = "public/",
    port = 3000


// data from form
let workoutData = [];

const server = http.createServer( function( request,response ) {
    if( request.method === "GET" ) {
        handleGet( request, response )
    }else if( request.method === "POST" ){
        handlePost( request, response )
    }else if( request.method === "DELETE" ){
        handleDelete( request, response )
    }

    // The following shows the requests being sent to the server
    // fullURL = `http://${request.headers.host}${request.url}`
    // console.log( fullURL );
})



const handleGet = function (request, response) {
    const filename = dir + request.url.slice(1);
    if (request.url === "/") {
        sendFile(response, "public/index.html");
    } else {
        sendFile(response, filename);
    }
};

const handlePost = function (request, response) {
    let storeData = "";

    request.on("data", function (data) {
        storeData += data;
    });

    request.on("end", function () {
        const formData = JSON.parse(storeData);

        // derived data to calculate the intensity
        const workoutIntensity = calculateIntensity(formData);

        // new entry to the table
        const formEntry = {
            "muscle-group": formData["muscle-group"],
            "numexercises": formData["numexercises"],
            "date": formData["date"],
            "workout-intensity": workoutIntensity,
            "comments": formData["comments"],
        };

        workoutData.push(formEntry);

        response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
        response.end(JSON.stringify(workoutData));
        // response.end("text")
    });
};

const sendFile = function( response, filename ) {
    const type = mime.getType( filename )

    fs.readFile( filename, function( err, content ) {

        // if the error = null, then we've loaded the file successfully
        if( err === null ) {

            // status code: https://httpstatuses.com
            response.writeHeader( 200, { "Content-Type": type })
            response.end( content )

        } else {

            // file not found, error code 404
            response.writeHeader( 404 )
            response.end( "404 Error: File Not Found" )

        }
    })
}

// our derived attribute function
const calculateIntensity = (data) => {

    // get the number of exercises
    const numExercises = parseInt(data["numexercises"], 10);

    // simple classification of intensity based on number of exercises
    if (numExercises >= 6) {
        return "High";

    } else if (numExercises >= 3) {
        return "Medium";

    } else {
        return "Low";
    }
};

const handleDelete = function(request, response) {

    // storing out data in string
    let storeData = "";

    // adding all the data into the string
    request.on("data", function(data) {
        storeData = storeData + data;
    });

    // event listener for when all the information is sent
    request.on("end", function() {
        const {
            // identifying the index to delete
            index } = JSON.parse(storeData);

        if (workoutData[index]) {
            // deleting the index of that row
            workoutData.splice(index, 1);
        }

        response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
        response.end(JSON.stringify(workoutData));
    });
};



// process.env.PORT references the port that Glitch uses
// the following line will either use the Glitch port or one that we provided
server.listen( process.env.PORT || port )