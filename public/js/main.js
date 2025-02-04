// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
    event.preventDefault();

    const title = document.querySelector( "#title" ).value;
    const className = document.querySelector( "#class" ).value;
    const currentDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date(document.querySelector("#due-date").value).toISOString().split('T')[0];
    const priority = document.querySelector("#priority").value;
    const estimation = document.querySelector("#estimation").value;

    const json = {
        title: title,
        class: className,
        currentDate: currentDate,
        dueDate: dueDate,
        priority: priority,
        estimation: estimation,
    };

    const body = JSON.stringify( json )

    const response = await fetch( "/submit", {
        method:'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: body
    })

    const text = await response.text()
    const data = JSON.parse(text)

    document.querySelector("form").reset();
    const form = document.querySelector(".habit");
    const overlay = document.querySelector(".overlay");
    form.classList.toggle("show");
    overlay.classList.toggle("show");
    refreshTable(data);
}

const edit = async function (event) {
    event.preventDefault();

    const title = document.querySelector("#title").value;
    const originalTitle = document.querySelector("#title").dataset.originalTitle;
    const className = document.querySelector("#class").value;
    const dueDate = new Date(document.querySelector("#due-date").value).toISOString().split('T')[0];
    const priority = document.querySelector("#priority").value;
    const estimation = document.querySelector("#estimation").value;
    const currentDate = new Date().toISOString().split('T')[0];

    const json = {
        action: "edit",
        originalTitle: originalTitle,
        title: title,
        class: className,
        currentDate: currentDate,
        dueDate: dueDate,
        priority: priority,
        estimation: estimation,
    };

    const response = await fetch("/edit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(json),
    });

    const data = await response.json();
    document.querySelector("form").reset();
    refreshTable(data.data);

    document.querySelector(".habit").classList.remove("show");
    document.querySelector(".overlay").classList.remove("show");
};

const refreshTable = function(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    data.forEach((item) => {
        const row = document.createElement("tr");

        const titleCell = document.createElement("td");
        titleCell.textContent = item.title;
        row.appendChild(titleCell);

        const classCell = document.createElement("td");
        classCell.textContent = item.class;
        row.appendChild(classCell);

        const dueDateCell = document.createElement("td");
        dueDateCell.textContent = item.dueDate;
        row.appendChild(dueDateCell);

        const priorityCell = document.createElement("td");
        priorityCell.textContent = item.priority;
        row.appendChild(priorityCell);

        const estimationCell = document.createElement("td");
        estimationCell.textContent = item.estimation;
        row.appendChild(estimationCell);

        const timeLeftCell = document.createElement("td");
        timeLeftCell.textContent = item.timeLeft;
        row.appendChild(timeLeftCell);

        const staticEditCell = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.textContent = "edit";
        editButton.classList.add("edit");
        staticEditCell.appendChild(editButton);

        editButton.addEventListener("click", (event) => {
            const row = event.target.closest("tr");
            const cells = row.querySelectorAll("td");

            document.querySelector("#title").value = cells[0].textContent;
            document.querySelector("#class").value = cells[1].textContent;
            document.querySelector("#due-date").value = new Date(cells[2].textContent).toISOString().split("T")[0];
            document.querySelector("#priority").value = cells[3].textContent;
            document.querySelector("#estimation").value = cells[4].textContent;
            document.querySelector("#title").dataset.originalTitle = cells[0].textContent;

            document.querySelector(".habit").classList.add("show");
            document.querySelector(".overlay").classList.add("show");

            const submitButton = document.querySelector("#submit");
            submitButton.onclick = edit;
        });

        row.appendChild(staticEditCell);


        const deleteCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete";
        deleteButton.classList.add("delete");
        deleteCell.appendChild(deleteButton);

        deleteButton.addEventListener("click", () => {
            handleDelete(item.title);
        });

        row.appendChild(deleteCell);
        tableBody.appendChild(row);
    });
}

const handleDelete = async function(title) {
    const response = await fetch("/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title }),
    });

    const data = await response.json();
    if (data.success) {
        refreshTable(data.data);
    }
};


const populate = async function () {
    const response = await fetch("/populate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    });

    const data = await response.json();
    refreshTable(data.data);
};

window.onload = function() {
    const button = document.querySelector("#submit");
    button.onclick = submit;

    const openFormButton = document.querySelector("#open-form");
    const form = document.querySelector(".habit");


    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    openFormButton.addEventListener("click", () => {
        document.querySelector("form").reset();
        form.classList.toggle("show");
        overlay.classList.toggle("show");
        button.onclick = submit;
    });

    overlay.addEventListener("click", () => {
        document.querySelector("form").reset();
        form.classList.remove("show");
        overlay.classList.remove("show");
    });

    populate();
};
