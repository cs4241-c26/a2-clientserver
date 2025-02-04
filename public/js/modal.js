// FRONT-END (CLIENT) JAVASCRIPT FOR MODAL

function openModal() {
  const modal = document.querySelector("#todoModal");
  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.querySelector("#todoModal");
  modal.style.display = "none";
  resetForm(); // Ensure form is cleared when closing modal
}

function resetForm() {
  document.querySelector("#todoForm").reset();

  // Get the current date in Eastern Time
  const now = new Date();

  // Use Intl.DateTimeFormat to convert to Eastern Time (America/New_York)
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  // Set the value of the span to the current date in Eastern Time
  const creationDateSpan = document.querySelector("#creation_date");
  creationDateSpan.textContent = formattedDate;
}

async function submitTodo(event) {
    
  event.preventDefault();

  const taskInput = document.querySelector("#task").value.trim();
  const priorityInput = document.querySelector("#priority").value;
  const creationDate = new Date().toISOString(); // Set current timestamp

  if (!taskInput) {
    alert("Task cannot be empty!");
    return;
  }
  if (!priorityInput) {
    alert("Priority must be selected!");
    return;
  }

  const todoItem = {
    task: taskInput,
    priority: priorityInput,
    creation_date: creationDate,
  };

  const response = await fetch("/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todoItem),
  });

  if (response.ok) {
    closeModal();
    initTodos(); // Refresh todo table
  } else {
    console.error("Failed to add todo item.");
  }
}

function initModal() {
  const fab = document.querySelector("#fab");
  const closeButton = document.querySelector(".close");
  const modal = document.querySelector("#todoModal");
  const submitButton = document.querySelector("#submitTodo");
  const cancelButton = document.querySelector("#cancelModal");
  const resetButton = document.querySelector("#resetForm");

  fab.onclick = openModal;
  closeButton.onclick = closeModal;
  cancelButton.onclick = closeModal;
  resetButton.onclick = resetForm;
  submitButton.onclick = submitTodo;

  // Close modal if clicking outside the modal content
  window.onclick = function (event) {
    if (event.target === modal) {
      closeModal();
    }
  };

  // Set the creation date in the modal when it's opened
  const creationDateSpan = document.querySelector("#creation_date");

  // Get the current date in Eastern Time
  const now = new Date();

  // Format the date in Eastern Time (America/New_York)
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  // Set the value of the span to the current date in Eastern Time
  creationDateSpan.textContent = formattedDate;
}

window.onload = function () {
  initTodos();
  initModal();
};
