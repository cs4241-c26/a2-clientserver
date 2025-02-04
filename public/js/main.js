const submit = async function (event) {
    event.preventDefault();

    const title = document.querySelector("#title");
    const genre = document.querySelector("#genre");
    const duration = document.querySelector("#duration");
    const priority = document.querySelector("#priority");

    const json = {
        title: title.value,
        genre: genre.value,
        duration: duration.value,
        priority: priority.value
    };
    const body = JSON.stringify(json);

    const response = await fetch("/submit", {
        method: "POST",
        body
    });

    const res = await response.text();
    let movies = JSON.parse(res);
    console.log("movies:", movies);

    closeModal();
    displayMovies(movies);
};

const deleteMovie = async function (title) {
    const json = { title };
    const body = JSON.stringify(json);

    const response = await fetch("/delete", {
        method: "DELETE",
        body
    });

    const res = await response.text();
    let movies = JSON.parse(res);
    console.log("movies:", movies);

    displayMovies(movies);
};

const editMovie = async function (oldTitle, newTitle, genre, duration, priority) {
    const json = {
        oldTitle,
        title: newTitle,
        genre,
        duration,
        priority
    };
    const body = JSON.stringify(json);

    const response = await fetch("/edit", {
        method: "PUT",
        body
    });

    const res = await response.text();
    let movies = JSON.parse(res);
    console.log("movies:", movies);

    displayMovies(movies);
};

const displayMovies = function (movies) {
    const movieList = document.getElementById("movie-list");
    movieList.innerHTML = ""; // Clear previous table

    const table = document.createElement("table");
    const headerRow = document.createElement("tr");

    const headers = ["Title", "Genre", "Duration", "Priority", "Commitment", "Actions"];
    headers.forEach(headerText => {
        const header = document.createElement("th");
        header.textContent = headerText;
        headerRow.appendChild(header);
    });

    table.appendChild(headerRow);

    movies.forEach(movie => {
        const row = document.createElement("tr");

        Object.values(movie).forEach(text => {
            const cell = document.createElement("td");
            if (text === movie.duration) {
                const hours = Math.floor(text / 60);
                const minutes = text % 60;
                cell.textContent = `${hours}h ${minutes}m`;
            } else {
                cell.textContent = text;
            }
            row.appendChild(cell);
        });

        const actionsCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.classList.add("action-btn");
        editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>`;
        editButton.onclick = () => {
            // Populate the form with the current movie data
            document.querySelector("#title").value = movie.title;
            document.querySelector("#genre").value = movie.genre;
            document.querySelector("#duration").value = movie.duration;
            document.querySelector("#priority").value = movie.priority;

            // Change the modal title to match the action
            const modalTitle = document.getElementById("modal-title");
            modalTitle.textContent = "Edit Movie";

            // Show the modal
            const modal = document.getElementById("addMovieModal");
            modal.style.display = "flex";

            // Change the submit button action to edit
            const submitButton = document.querySelector("#submitBtn");
            submitButton.textContent = "Save";
            submitButton.onclick = async function (event) {
                event.preventDefault();
                await editMovie(
                    movie.title,
                    document.querySelector("#title").value,
                    document.querySelector("#genre").value,
                    document.querySelector("#duration").value,
                    document.querySelector("#priority").value
                );
                closeModal();
            };
        };
        actionsCell.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("action-btn",);
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="24px" fill="#cc2616"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>`;
        deleteButton.onclick = () => deleteMovie(movie.title);
        actionsCell.appendChild(deleteButton);

        row.appendChild(actionsCell);
        table.appendChild(row);
    });

    movieList.appendChild(table);
};

const closeModal = function () {
    const title = document.querySelector("#title");
    const genre = document.querySelector("#genre");
    const duration = document.querySelector("#duration");
    const priority = document.querySelector("#priority");

    const modal = document.getElementById("addMovieModal");

    title.value = "";
    genre.value = "";
    duration.value = "";
    priority.value = "";

    modal.style.display = "none";

    // Reset the modal title
    const modalTitle = document.getElementById("modal-title");
    modalTitle.textContent = "Add Movie";

    // Reset the submit button action to add
    const submitButton = document.querySelector("#submitBtn");
    submitButton.onclick = submit;
    submitButton.textContent = "Add";
};

window.onload = async function () {
    const modal = document.getElementById("addMovieModal");
    const addMovieBtn = document.getElementById("addMovieBtn");
    const closeModalBtn = document.getElementsByClassName("close-modal")[0];

    addMovieBtn.onclick = function () {
        modal.style.display = "flex";
    };

    closeModalBtn.onclick = closeModal;

    window.onclick = function (event) {
        if (event.target == modal) {
            closeModal();
        }
    };

    const submitButton = document.querySelector("#submitBtn");
    submitButton.onclick = submit;

    const res = await fetch("/movies");
    const movies = await res.json();
    displayMovies(movies);
};