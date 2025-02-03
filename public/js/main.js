// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()


    // get form data
    const formData = new FormData(document.querySelector('form'));

    // store form data
    const data = {};


    // fill out form data
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // call server with post req
    const response = await fetch('/', {
        method: 'POST',
        body: JSON.stringify(data)
    });

    // server response
    const result = await response.json();

    // find the table
    const workoutTable = document.querySelector('#workout-table tbody');

    // get rid of all the rows
    workoutTable.innerHTML = '';

    // looping through all the fields to add it to the tr element
    result.forEach((row, index) => {
        const tr = document.createElement('tr');

        // all our fields
        // using formIndex to store what row we want to delete
        tr.innerHTML = `
            <td>${row['muscle-group']}</td>
            <td>${row['numexercises']}</td>
            <td>${row['date']}</td>
            <td>${row['comments']}</td>
            <td>${row['workout-intensity']}</td>
            <td><button class="deleteButton" formIndex="${index}">Delete</button></td>
        `;


        // adding it to the table
        workoutTable.appendChild(tr);
    });

    // adding button for deletion, waiting to be pressed
    document.querySelectorAll('.deleteButton').forEach(button => {
        button.addEventListener('click', deleteForm);
    });
};

// delete form function
const deleteForm = async (event) => {

    // get the index of the row targeting
    const index = event.target.getAttribute('formIndex');

    // sending delete request with index to delete which row
    const response = await fetch('/delete', {
        method: 'DELETE',
        body: JSON.stringify({
            index: index }),
    });

    // looking for new result of entries
    const result = await response.json();

    // call function to fix front end
    updateWorkoutTable(result);
};

// updating table function after any req to the server
const updateWorkoutTable = (workoutData) => {

    // find the table and clear existing data
    const workoutTable = document.querySelector('#workout-table tbody');
    workoutTable.innerHTML = '';


    // for each loop to fill out entries
    workoutData.forEach((row, index) => {
        const tr = document.createElement('tr');

        // fill out HTML fields
        tr.innerHTML = `
            <td>${row['muscle-group']}</td>
            <td>${row['numexercises']}</td>
            <td>${row['date']}</td>
            <td>${row['comments']}</td>
            <td>${row['workout-intensity']}</td>
            <td><button class="deleteButton" formIndex="${index}">Delete</button></td>
        `;

        // append new row to the table
        workoutTable.appendChild(tr);
    });

    // add event listener to each button
    document.querySelectorAll('.deleteButton').forEach(button => {
        button.addEventListener('click', deleteForm);
    });
};


// submit button
window.onload = function() {
    const form = document.querySelector('form');
    form.addEventListener('submit', submit);
};
