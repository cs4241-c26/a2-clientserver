const http = require( "node:http" ),
    fs   = require( "node:fs" ),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library if you're testing this on your local machine.
    // However, Glitch will install it automatically by looking in your package.json
    // file.
    mime = require( "mime" ),
    dir  = "public/",
    port = 3000

// Initial anime dataset (I hope you like Death Note)
const animeData = [
    { 
        "id": 1,
        "title": "Death Note", 
        "rating": 9, 
        "episodes": 37,
        "dateAdded": "2024-03-20",
        "popularityScore": 8.7 
    }
]

// Calculate popularity score based on rating and episodes
function calculatePopularityScore(rating, episodes) {
    // added so popularity score is more accurate
    const RATING_WEIGHT = 0.7;    
    const EPISODE_WEIGHT = 0.3;   
    
    // Normalize episodes to a 1-10 scale
    // just for sake, made 150 episodes assumed max
    const normalizedEpisodes = Math.min(10, (episodes / 15));
    
    const weightedScore = (rating * RATING_WEIGHT) + (normalizedEpisodes * EPISODE_WEIGHT);
    
    return Math.min(10, Math.max(1, Number(weightedScore.toFixed(1))));
}

// let fullURL = ""
const server = http.createServer(function(request, response) {
    if (request.method === "GET") {
        handleGet(request, response)
    } else if (request.method === "POST") {
        handlePost(request, response)
    } else if (request.method === "DELETE") {
        handleDelete(request, response)
    } else if (request.method === "PUT") {
        handlePut(request, response)
    }
    
    // The following shows the requests being sent to the server
    const fullURL = `http://${request.headers.host}${request.url}`
    console.log( fullURL );
})

const handleGet = function( request, response ) {
    if (request.url === "/api/anime") {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.end(JSON.stringify(animeData))
        return
    }

    const filename = dir + request.url.slice( 1 )

    if( request.url === "/" ) {
        sendFile( response, "public/index.html" )
    }else{
        sendFile( response, filename )
    }
}

const handlePost = function( request, response ) {
    let dataString = ""

    request.on( "data", function( data ) {
        dataString += data
    })

    request.on( "end", function() {
        const newAnime = JSON.parse(dataString)
        
        newAnime.id = animeData.length + 1
        newAnime.dateAdded = new Date().toISOString().split('T')[0]
        newAnime.popularityScore = calculatePopularityScore(
            Number(newAnime.rating), 
            Number(newAnime.episodes)
        )
        
        animeData.push(newAnime)

        response.writeHead(200, { "Content-Type": "application/json" })
        response.end(JSON.stringify(animeData))
    })
}

// to delete anime
const handleDelete = function(request, response) {
    const id = parseInt(request.url.split('/').pop())
    const index = animeData.findIndex(anime => anime.id === id)
    
    if (index !== -1) {
        animeData.splice(index, 1)
    }
    
    response.writeHead(200, { "Content-Type": "application/json" })
    response.end(JSON.stringify(animeData))
}

const handlePut = function(request, response) {
    let dataString = ""

    request.on("data", function(data) {
        dataString += data
    })

    request.on("end", function() {
        const id = parseInt(request.url.split('/').pop())
        const updatedAnime = JSON.parse(dataString)
        
        const index = animeData.findIndex(anime => anime.id === id)
        if (index !== -1) {
            updatedAnime.id = id
            updatedAnime.dateAdded = animeData[index].dateAdded
            updatedAnime.popularityScore = calculatePopularityScore(
                Number(updatedAnime.rating), 
                Number(updatedAnime.episodes)
            )
            
            animeData[index] = updatedAnime
        }

        response.writeHead(200, { "Content-Type": "application/json" })
        response.end(JSON.stringify(animeData))
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

// process.env.PORT references the port that Glitch uses
// the following line will either use the Glitch port or one that we provided
server.listen( process.env.PORT || port )

