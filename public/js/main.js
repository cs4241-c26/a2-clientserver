// FRONT-END (CLIENT) JAVASCRIPT HERE
console.log("main.js loaded");

const submit = async function( event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()

    const courseCodeInput = document.querySelector("#addCourseCode"),
        courseNameInput = document.querySelector("#addCourseName"),
        courseCreditsInput = document.querySelector("#addCourseCredits"),
        json = {
            cCode: courseCodeInput.value.trim(),
            cName: courseNameInput.value.trim(),
            cCredits: courseCreditsInput.value.trim(),
        }

    if (!json.cCode || !json.cName || !json.cCredits) {
        console.error("Missing input Values!");
        return;
    }

    const body = JSON.stringify(json);

    try {
        const response = await fetch("/submit", {
            method: "POST",
            body,
        });

        if (!response.ok) {
            throw new Error("Failed to submit course");
        } else{
            console.log("Course submitted: " + JSON.stringify(json));
        }
        await renderTable();
    } catch (err) {
        console.error("Error:", err.message);
    }

}

const renderTable = async function () {
    let data = [];
    try { //I put this here because it's much cleaner
        const response = await fetch("/courses");
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        data = await response.json();
    } catch (err) {
        console.error("Error fetching data on load:", err.message);
        return;
    }

    const tableBody = document.querySelector("#resultsTable tbody");
    tableBody.innerHTML = "";

    data.forEach((course) => {
        const row = document.createElement("tr");

        const numberCell = document.createElement("td");
        numberCell.textContent = course.cNumber;
        const prefixCell = document.createElement("td");
        prefixCell.textContent = course.cPrefix;
        const courseCodeCell = document.createElement("td");
        courseCodeCell.textContent = course.cCode; //display only number
        const courseNameCell = document.createElement("td");
        courseNameCell.textContent = course.cName;
        const courseCreditsCell = document.createElement("td");
        courseCreditsCell.textContent = course.cCredits;

        const actionsCell = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.onclick = () => toggleEdit(row, course, course.cNumber - 1);

        actionsCell.appendChild(editButton);


        row.appendChild(numberCell);
        row.appendChild(prefixCell);
        row.appendChild(courseCodeCell);
        row.appendChild(courseNameCell);
        row.appendChild(courseCreditsCell);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });
};


const toggleEdit = function (row, course, index) {
    console.log("editing index: " + index)
    const cells = row.querySelectorAll("td");
    const coursePrefixCell = cells[1];
    const courseCodeCell = cells[2];
    const courseNameCell = cells[3];
    const courseCreditsCell = cells[4];
    const actionsCell = cells[5];

    // store original data
    const originalCoursePrefix = coursePrefixCell.textContent;
    const originalCourseCode = courseCodeCell.textContent;
    const originalCourseName = courseNameCell.textContent;
    const originalCourseCredits = courseCreditsCell.textContent;

    // replace with input fields for editing
    const coursePrefixInput = document.createElement("input");
    coursePrefixInput.type = "text";
    coursePrefixInput.value = course.cPrefix;

    const courseCodeInput = document.createElement("input");
    courseCodeInput.type = "number";
    courseCodeInput.value = course.cCode;

    const courseNameInput = document.createElement("textarea");
    courseNameInput.value = course.cName;

    const courseCreditsInput = document.createElement("input");
    courseCreditsInput.type = "number";
    courseCreditsInput.value = course.cCredits;

    coursePrefixCell.innerHTML = "";
    coursePrefixCell.appendChild(coursePrefixInput);

    courseCodeCell.innerHTML = "";
    courseCodeCell.appendChild(courseCodeInput);

    courseNameCell.innerHTML = "";
    courseNameCell.appendChild(courseNameInput);

    courseCreditsCell.innerHTML = "";
    courseCreditsCell.appendChild(courseCreditsInput);


    // replace Edit with Submit, Delete, Cancel buttons
    actionsCell.innerHTML = "";
    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.onclick = async () => {
        await handleEditSubmit(coursePrefixInput, courseCodeInput, courseNameInput, courseCreditsInput, index);
    };

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = async () => {
        try {
            const response = await fetch(`/delete/${index}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete course on the server");
            }
            await renderTable();
        } catch (err) {
            console.error("Error deleting course:", err.message);
            alert("Failed to delete. Please try again later.");
        }
    };

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";

    cancelButton.onclick = () => {
        // restore original values
        coursePrefixCell.textContent = originalCoursePrefix;
        courseCodeCell.textContent = originalCourseCode;
        courseNameCell.textContent = originalCourseName;
        courseCreditsCell.textContent = originalCourseCredits;

        actionsCell.innerHTML = "";
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = () => toggleEdit(row, course, index);
        actionsCell.appendChild(editButton);
    };

    // handle enter
    const handleEnterKey = async (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            await handleEditSubmit(coursePrefixInput, courseCodeInput, courseNameInput, courseCreditsInput, index);
        }
    };

    coursePrefixInput.addEventListener("keydown", handleEnterKey);
    courseCodeInput.addEventListener("keydown", handleEnterKey);
    courseNameInput.addEventListener("keydown", handleEnterKey);
    courseCreditsInput.addEventListener("keydown", handleEnterKey);


    actionsCell.appendChild(submitButton);
    actionsCell.appendChild(deleteButton);
    actionsCell.appendChild(cancelButton);
};


const handleEditSubmit = async (coursePrefixInput, courseCodeInput, courseNameInput, courseCreditsInput, index) => {

    const updatedCourse = {
        cPrefix: coursePrefixInput.value.trim(),
        cCode: courseCodeInput.value.trim(),
        cName: courseNameInput.value.trim(),
        cCredits: courseCreditsInput.value.trim(),
    };

    // Validate input values
    if (!updatedCourse.cPrefix || !updatedCourse.cCode || !updatedCourse.cName || !updatedCourse.cCredits) {
        alert("All fields must be filled!");
        return;
    }

    try {
        // Send updated data to server
        const response = await fetch(`/edit/${index}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedCourse),
        });

        if (!response.ok) {
            throw new Error("Failed to update course on the server");
        }

        // re-render table
        await renderTable();
    } catch (err) {
        console.error("Error updating course:", err.message);
        alert("Failed to update. Please try again later.");
    }
};


const clearTable = async function () {
    try {
        const response = await fetch("/clear", { method: "DELETE" });
        if (!response.ok) {
            throw new Error("Failed to clear data on server");
        }
        const tableBody = document.querySelector("#resultsTable tbody");
        tableBody.innerHTML = ""; // no need to query server
        console.log("Data cleared");
    } catch (err) {
        console.error("Error:", err.message);
    }
};



/* Comment out the onload for server-side so the button does not get assigned to a handler */
window.onload = async function () {
    await renderTable();

    const button = document.querySelector("#submit");
    button.onclick = submit;

    const clearButton = document.querySelector("#clearTableButton");
    clearButton.onclick = clearTable;
};
