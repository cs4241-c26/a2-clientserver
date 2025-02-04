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
        if (elem.value.length === 0){
            alert("Field cannot be empty!")
            return
        }
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
    await updateTable()
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
    await updateTable()
}

const deleteEntry = async function(event){
    event.preventDefault()
    const id = event.target.parentElement.parentElement.id
    console.log("attempting to delete", id)
    const response = await fetch( "/api/delete", {
        method:'POST',
        body: id
    })
    event.target.parentElement.parentElement.remove()
    if (!response.ok) {
        console.error("error response", response)
    }
    await updateTable()
}

const addActionCol = async function(row) {
    let btn_delete = document.createElement("button")
    btn_delete.textContent = "Delete"
    btn_delete.addEventListener("click", deleteEntry)
    let action_col = document.createElement("td")
    action_col.appendChild(btn_delete)
    row.appendChild(action_col)
}

const updateTable = async function() {
    const rowdata = await fetch( "/api/tabledata" );
    if (!rowdata.ok) {
        console.log("error occurred: ", rowdata.error)
        return
    }
    const table = document.getElementById('datatable')
    const data = await rowdata.json()
    console.log( "data:", JSON.stringify(data) )
    const existing_row = document.getElementById("newdatarow")
    table.appendChild(existing_row)
    data.forEach( data_row => {
        if (document.getElementById( data_row.id ) !== null){
            return // already here, dont add again
        }
        // row doesn't exist yet
        const new_row = document.createElement("tr");
        new_row.id = data_row.id
        table.appendChild(new_row)
        table.insertBefore(new_row, existing_row)

        delete data_row.id
        Object.values(data_row).forEach( col => {
            const new_entry = document.createElement("td");
            new_entry.textContent = col
            new_row.appendChild(new_entry)
        })
        addActionCol(new_row)
    })
}