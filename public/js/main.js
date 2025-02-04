function formatDateTime(isoString) {
    const date = new Date(isoString);
    return `${date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })} ${date.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
    })}`;
}

function fetchTodos() {
    fetch('/api/todos')
        .then(response => response.json())
        .then(todos => {
            const categoryFilter = document.getElementById('categoryFilter').value;
            const todosBody = document.getElementById('todosBody');
            todosBody.innerHTML = '';
            
            (categoryFilter === 'all' ? todos : todos.filter(todo => todo.category === categoryFilter))
                .forEach(todo => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>
                            <input type="checkbox" class="todo-checkbox" data-id="${todo.id}" ${todo.completed ? 'checked' : ''}>
                            <span class="task-text ${todo.completed ? 'completed' : ''}">${todo.task}</span>
                        </td>
                        <td><span class="category-pill category-${todo.category}">${todo.category}</span></td>
                        <td><span class="priority-pill priority-${todo.priority}">${todo.priority}</span></td>
                        <td>${formatDateTime(todo.creationDate)}</td>
                        <td>${formatDateTime(todo.deadline)}</td>
                        <td>
                            <i class="fa-solid fa-pen-to-square edit-btn" onclick="makeEditable(this, ${todo.id})"></i>
                            <i class="fa-solid fa-trash-can delete-btn" onclick="deleteTodo(${todo.id})"></i>
                        </td>
                    `;
                    todosBody.appendChild(row);
                });

            document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    toggleTodo(parseInt(this.dataset.id), this.checked, this);
                });
            });
        });
}

function addTodo(event) {
    event.preventDefault();
    const customDeadline = document.getElementById('customDeadline').value;
    
    if (customDeadline && new Date(customDeadline) < new Date()) {
        alert('Deadline cannot be in the past!');
        return;
    }
    
    fetch('/api/todos', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            task: document.getElementById('task').value,
            category: document.getElementById('category').value,
            priority: document.getElementById('priority').value,
            customDeadline
        })
    })
    .then(response => response.json())
    .then(() => {
        document.getElementById('todoForm').reset();
        fetchTodos();
    });
}

function deleteTodo(id) {
    fetch(`/api/todos/${id}`, { method: 'DELETE' })
        .then(() => fetchTodos());
}

function toggleTodo(id, completed, checkbox) {
    fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ completed })
    })
    .then(response => response.json())
    .then(() => {
        const span = checkbox.nextElementSibling;
        span.classList.toggle('completed', completed);
    });
}

function makeEditable(editIcon, todoId) {
    const taskSpan = editIcon.closest('tr').querySelector('.task-text');
    
    if (editIcon.classList.contains('fa-save')) {
        const input = taskSpan.querySelector('input');
        if (input.value.trim()) {
            saveEdit(taskSpan, input.value, todoId);
            editIcon.classList.replace('fa-save', 'fa-pen-to-square');
        }
        return;
    }
    
    if (!taskSpan.querySelector('input')) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = taskSpan.textContent;
        input.className = 'edit-input';
        taskSpan.innerHTML = '';
        taskSpan.appendChild(input);
        input.focus();
        
        editIcon.classList.replace('fa-pen-to-square', 'fa-save');
        
        const saveIfValid = () => {
            if (input.value.trim() && editIcon.classList.contains('fa-save')) {
                saveEdit(taskSpan, input.value, todoId);
                editIcon.classList.replace('fa-save', 'fa-pen-to-square');
            }
        };
        
        input.addEventListener('blur', () => setTimeout(saveIfValid, 100));
        input.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveIfValid();
            }
        });
    }
}

function saveEdit(span, newText, todoId) {
    fetch(`/api/todos/${todoId}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ task: newText })
    })
    .then(response => response.json())
    .then(todo => {
        span.textContent = todo.task;
        span.classList.toggle('completed', todo.completed);
    })
    .catch(() => fetchTodos());
}

document.getElementById('todoForm').addEventListener('submit', addTodo);
document.getElementById('categoryFilter').addEventListener('change', fetchTodos);
fetchTodos(); 