// FRONT-END (CLIENT) JAVASCRIPT HERE

function updateTodosTable(todos) {
  const tableBody = document.querySelector("#todoTable tbody");

  if (!tableBody) {
    console.error("Table body not found!");
    return;
  }

  // Clear existing rows
  tableBody.innerHTML = "";

  todos.forEach((todo) => {
    const row = tableBody.insertRow();

    const taskCell = row.insertCell(0);
    taskCell.textContent = todo.task;

    const priorityCell = row.insertCell(1);
    priorityCell.textContent = todo.priority;

    const dateCell = row.insertCell(2);
    dateCell.textContent = new Date(todo.creation_date).toDateString(); // Formatting date

    const dueDateCell = row.insertCell(3);
    dueDateCell.textContent = new Date(todo.due_date).toDateString(); // Formatting date

    const actionsCell = row.insertCell(4); // Actions column
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.title = "Delete task";
    deleteButton.classList.add("delete-btn");
    deleteButton.onclick = function () {
      if (confirm("Are you sure you want to delete this task?")) {
        deleteTodo(todo, row);
      }
    };
    actionsCell.appendChild(deleteButton);
  });
}

function initTodos() {
  fetch("/todos")
    .then((response) => response.json())
    .then((data) => {
      updateTodosTable(data);
    })
    .catch((error) => console.error("Error fetching todos:", error));
}

// Function to delete the todo from the table and the server
function deleteTodo(todo, row) {
  // Make a DELETE request to the server
  fetch(`/todos/${todo.task}`, {
    method: "DELETE",
  })
    .then((response) => response.text())
    .then((text) => {
      console.log("Delete successful:", text);
      // Update the table to reflect the deletion
      row.remove();
    })
    .catch((error) => console.error("Error deleting todo:", error));
}

window.onload = function () {
  initTodos();
  const button = document.querySelector("button");
  button.onclick = submit;
};
