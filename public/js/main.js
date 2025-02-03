document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("exercise-form");
    const tableBody = document.querySelector("#exercise-table tbody");
    const editIndex = document.getElementById("edit-index");

    fetch("/data")
        .then((response) => response.json())
        .then((data) => updateTable(data));

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        if (editIndex.value !== "") {
            // Update existing entry
            fetch(`/update/${editIndex.value}`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            })
                .then((response) => response.json())
                .then((data) => {
                    updateTable(data);
                    editIndex.value = ""; // Reset edit mode
                });
        } else {
            // Add new exercise
            fetch("/add", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            })
                .then((response) => response.json())
                .then((data) => updateTable(data));
        }

        form.reset();
    });

    const updateTable = (data) => {
        tableBody.innerHTML = "";
        data.forEach((item, index) => {
            const row = `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.type}</td>
                    <td>${item.duration}</td>
                    <td>${item.notes || "N/A"}</td>
                    <td>
                        <button class="edit-btn" data-index="${index}">Edit</button>
                        <button class="delete-btn" data-index="${index}">Delete</button>
                    </td>
                </tr>`;
            tableBody.insertAdjacentHTML("beforeend", row);
        });

        document.querySelectorAll(".edit-btn").forEach((btn) => {
            btn.addEventListener("click", (event) => {
                const index = event.target.getAttribute("data-index");
                const item = data[index];

                document.getElementById("name").value = item.name;
                document.getElementById("type").value = item.type;
                document.getElementById("duration").value = item.duration;
                document.getElementById("notes").value = item.notes;
                editIndex.value = index;
            });
        });

        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const index = btn.getAttribute("data-index");
                fetch(`/delete/${index}`, { method: "DELETE" })
                    .then((response) => response.json())
                    .then((data) => updateTable(data));
            });
        });
    };
});
