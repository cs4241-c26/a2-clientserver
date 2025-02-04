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
    { id: crypto.randomUUID(), itemname: 'test1', qty: '3', date: '2025-02-04', type: 'poultry' },
    { id: crypto.randomUUID(), itemname: 'test2', qty: '1', date: '2025-02-01', type: 'beef' }
]

// these are mostly guesses for demonstration please dont rely on my homework for food saftey
const foodtypes = {
    "poultry": 4,
    "beef": 5,
    "leafy greens": 5,
    "rooted vegetable": 14,
    "fruit": 7,
    "dairy": 10,
    "bread": 12,
    "canned": 600,
    "dry goods": 360
}

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
    else if ( request.url.includes('/api')) {
        api( request, response )
    }
    else {
        sendFile( response, filename )
    }
}

const handlePost = function( request, response ) {
    let dataString = ""

    request.on( "data", function( data ) {
        dataString += data
    })

    request.on( "end", function() {
        if (request.url.includes("/api/delete")){
            del(dataString)
            response.writeHead(200, "OK")
            response.end()
            return
        }
        const data = JSON.parse( dataString )
        data.id = crypto.randomUUID()
        console.log( data )
        appdata.push( data )
        format_appdata() // calculates derived field
        response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
        response.end("text")
    })
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

const format_appdata = function() {
    // calculate if item is still ok
    const cur_date = new Date();
    appdata.forEach( function( item ) {
        // convert ms to days
        let diff = (cur_date - Date.parse(item.date))/(24 * 60 * 60 * 1000)
        let safe = "Yes"
        if (diff > foodtypes[item.type]) {
            safe = "No"
        }
        // update or add safe field
        item.safe = safe
    })
    return JSON.stringify(appdata)
}

const api = function( request, response ) {
    response.writeHeader(200, { "Content-Type": "application/json" })
    if (request.url.includes("tabledata")) {
        response.end(format_appdata())
        console.log("sent table")
    }
    else if (request.url.includes("types")) {
        response.end(JSON.stringify(foodtypes))
        console.log("sent food data")
    }
}

const del = function(id){
    console.log("deleting row", id)
    if (id.length === 0){
        console.error("delete fail, ID is empty!")
        return
    }
    appdata.splice(appdata.findIndex(item => item.id === id), 1)
}

// process.env.PORT references the port that Glitch uses
// the following line will either use the Glitch port or one that we provided
server.listen( process.env.PORT || port )

