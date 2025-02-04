const http = require( "node:http" ),
    fs   = require( "node:fs" ),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library if you're testing this on your local machine.
    // However, Glitch will install it automatically by looking in your package.json
    // file.
    mime = require( "mime" ),
    dir  = "public/",
    port = 3000

const appdata = [
]


// let fullURL = ""
const server = http.createServer( function( request,response ) {
    if( request.method === "GET" ) {
        handleGet( request, response )
    }else if( request.method === "POST" ){
        handlePost( request, response )
    }

    // The following shows the requests being sent to the server
    // fullURL = `http://${request.headers.host}${request.url}`
    // console.log( fullURL );
})

const handleGet = function( request, response ) {
    const filename = dir + request.url.slice( 1 )

    if( request.url === "/" ) {
        sendFile( response, "public/index.html" )
    }
    else{
        sendFile( response, filename )
    }
}

const handlePost = function( request, response ) {
    let dataString = ""

    request.on( "data", function( data ) {
        dataString += data
    })

    console.log( request.url );

    request.on("end", function () {


        let parsedData = JSON.parse(dataString);


        if (request.url === "/submit") {
            handleAdd(parsedData, response);
        } else if (request.url === "/edit") {
            handleEdit(parsedData, response);
        } else if (request.url === "/populate") {
            handlePopulate(response);
        } else if (request.url === "/delete") {
            handleDelete(parsedData, response);
        }
        else {
            response.writeHead(404, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ success: false, message: "Route not found" }));
        }
    });
}

const handleAdd = function( parsedData, response ) {
    const currentDate = new Date(parsedData.currentDate);
    const dueDate = new Date(parsedData.dueDate);
    parsedData.timeLeft = (dueDate - currentDate) / (1000 * 60 * 60 * 24);

    appdata.push(parsedData);

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(appdata));
}

const handleEdit = function (parsedData, response) {
    console.log("here")
    console.log("parsed data: ", parsedData);
    console.log("appdata: ", appdata)
    const index = appdata.findIndex(item => item.title === parsedData.originalTitle);
    console.log("index: ", index)

    if (index !== -1) {

        const currentDate = new Date(parsedData.currentDate);
        const dueDate = new Date(parsedData.dueDate);

        parsedData.timeLeft = (dueDate - currentDate) / (1000 * 60 * 60 * 24);


        appdata[index] = { ...appdata[index], ...parsedData };

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ success: true, data: appdata }));
    } else {
        console.log("miss")
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ success: false, message: "Item not found" }));
    }
};

const handleDelete = function(parsedData, response) {
    const index = appdata.findIndex(item => item.title === parsedData.title);

    if (index !== -1) {
        appdata.splice(index, 1);
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ success: true, data: appdata }));
    } else {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ success: false, message: "Item not found" }));
    }
};

const handlePopulate = function( response ) {
    const currentDate = new Date();

    console.log( currentDate );

    appdata.forEach(item => {
        const dueDate = new Date(item.dueDate);
        console.log( dueDate );
        item.timeLeft = Math.round((dueDate - currentDate) / (1000 * 60 * 60 * 24));
        console.log("TIme left: ",item.timeLeft)

    });

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ success: true, data: appdata }));

}

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

// process.env.PORT references the port that Glitch uses
// the following line will either use the Glitch port or one that we provided
server.listen( process.env.PORT || port )

