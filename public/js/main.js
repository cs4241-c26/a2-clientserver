// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()
    const fields = ['itemname', 'qty', 'date', 'type']
    const data = {}
    fields.forEach( field => {
        const elem =document.getElementById( field )
        data[field] = elem.value
        // reset form after reading value
        elem.value = ''
    })
        body = JSON.stringify( data )

    const response = await fetch( "/submit", {
        method:'POST',
        body
    })

    const text = await response.text()
    console.log( "text:", text )
}

const getTypes = async function() {
    const response = await fetch( "/api/types" )
    if (response.ok) {
        const types = await response.json()
        const dropdown = document.getElementById('type')
        Object.keys(types).forEach( key => {
            const option = document.createElement("option");
            option.text = key
            option.value = key
            dropdown.appendChild(option)
        })
    }
}

window.onload = async function() {
    const button = document.getElementById("submit");
    button.onclick = submit;
    await getTypes()
    // todo: update rows
}

const updateTable = async function() {
    const rowdata = await fetch( "/api/tabledata" );

}