window.onload = function() {
    const button = document.querySelector("button");
    button.onclick = submit;
};

document.addEventListener("DOMContentLoaded", function () {
    function getApiUrl() {
        fetch("http://127.0.0.1:3000/getdata")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                const tableBody = document.querySelector("table tbody");
                tableBody.innerHTML = "";
                data.forEach(item => {
                    if (item.exercise && item.reps && item.weight) {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td data-field="exercise">${item.exercise}</td>
                            <td contenteditable="true" data-field="reps">${item.reps}</td>
                            <td contenteditable="true" data-field="weight">${item.weight}</td>
                            <td data-field="projected_1rm">${item.projected_1rm}</td>
                            <td>
                                <button class="delete-btn">X</button>
                            </td>
                        `;
                        tableBody.appendChild(row);
                    }
                });
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    document.querySelector("table tbody").addEventListener("click", function(event) {
        const rowElement = event.target.closest("tr");
        if (!rowElement) return;

        if (event.target.classList.contains("delete-btn")) {
            const rowData = extractRowData(rowElement);
            deleteExercise(rowData, rowElement);
        }
    });

    document.querySelector("table tbody").addEventListener("blur", function(event) {
        const cell = event.target;
        if (cell.tagName === "TD" && cell.hasAttribute("contenteditable")) {
            const rowElement = cell.closest("tr");
            const rowData = extractRowData(rowElement);
            updateExercise(rowData);
        }
    }, true); 


    function extractRowData(row) {
        return {
            exercise: row.children[0].textContent.trim(),
            reps: parseInt(row.children[1].textContent.trim(), 10),
            weight: parseFloat(row.children[2].textContent.trim()),
            projected_1rm: parseFloat(row.children[3].textContent.trim())
        };
    }

    async function deleteExercise(rowData, rowElement) {
        try {
            const response = await fetch("/delete", {
                method: "DELETE", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rowData) 
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            rowElement.remove();
        } catch (error) {
            console.error("Error deleting exercise:", error);
            alert("Failed to delete exercise.");
        }
    }

    async function updateExercise(rowData) {
        try {
            const response = await fetch("/update", {
                method: "PUT", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rowData)
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            getApiUrl();
        } catch (error) {
            console.error("Error updating exercise:", error);
            alert("Failed to update exercise.");
        }
    }

    const form = document.getElementById("dataForm");
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const exercise = document.getElementById("exercise").value.trim();
        const reps = document.getElementById("reps").value.trim();
        const weight = document.getElementById("weight").value.trim();

        if (!exercise || !reps || !weight || isNaN(reps) || isNaN(weight)) {
            alert("Please enter valid values for exercise, Reps (number), and Weight (number).");
            return;
        }

        const workoutData = {
            exercise: exercise,
            reps: parseInt(reps, 10), 
            weight: parseFloat(weight) 
        };

        try {
            const response = await fetch("/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(workoutData)
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            form.reset();
            getApiUrl();
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Failed to submit workout data.");
        }
    });

    getApiUrl();
});
