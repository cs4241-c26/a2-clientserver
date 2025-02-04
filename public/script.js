document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display todos from the server
    async function fetchTodos() {
      const response = await fetch('/todos');
      const todos = await response.json();
      const tbody = document.querySelector('#todosTable tbody');
      tbody.innerHTML = '';
      todos.forEach(todo => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${todo.id}</td>
          <td>${todo.task}</td>
          <td>${todo.priority}</td>
          <td>${todo.creation_date}</td>
          <td>${todo.deadline}</td>
          <td><button class="delete-btn" data-id="${todo.id}">Delete</button></td>
          <td><button class="edit-btn" data-id="${todo.id}">Edit</button></td>
        `;
        tbody.appendChild(tr);
      });
    }
  
    async function deleteTodo(id) {
      const response = await fetch(`/todos?id=${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchTodos();
      } else {
        const errorText = await response.text();
        alert("Error deleting todo: " + errorText);
      }
    }
  
    async function editTodo(id) {
      const task = prompt("Enter new task:");
      const priority = prompt("Enter new priority (1=High, 2=Medium, 3=Low):");
  
      if (task && priority) {
        const response = await fetch(`/edit-todo`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id, task, priority })
        });
        if (response.ok) {
          fetchTodos();
        } else {
          const errorText = await response.text();
          alert("Error editing todo: " + errorText);
        }
      } else {
        alert("All fields are required for editing a todo.");
      }
    }
  
    document.querySelector('#todosTable').addEventListener('click', function(e) {
      if (e.target && e.target.matches('button.delete-btn')) {
        const id = e.target.getAttribute('data-id');
        deleteTodo(id);
      }
    });
  
    document.querySelector('#todosTable').addEventListener('click', function(e) {
      if (e.target && e.target.matches('button.edit-btn')) {
        const id = e.target.getAttribute('data-id');
        editTodo(id);
      }
    });
  
    fetchTodos();
  });