const { ipcRenderer } = require('electron');

let todos = [];

async function loadTodos() {
    todos = await ipcRenderer.invoke('get-todos');
    renderTodos();
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${todo.date}</td>
      <td class="toggle-btn">${todo.title}</td>
      <td><button onclick="toggleDone(${index})">${todo.done ? 'Done' : 'Not Done'}</button></td>
    `;
        todoList.appendChild(tr);

        const descriptionRow = document.createElement('tr');
        descriptionRow.innerHTML = `
      <td colspan="3" class="description">${todo.description}</td>
    `;
        todoList.appendChild(descriptionRow);

        tr.querySelector('.toggle-btn').addEventListener('click', () => {
            descriptionRow.querySelector('.description').style.display =
                descriptionRow.querySelector('.description').style.display === 'none' ? 'table-cell' : 'none';
        });
    });
}

async function addTodo(event) {
    event.preventDefault();
    const titleInput = document.getElementById('todoTitle');
    const descriptionInput = document.getElementById('todoDescription');

    // 現在の日時を取得
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD 形式
    const formattedTime = now.toTimeString().split(' ')[0]; // HH:MM:SS 形式

    const newTodo = {
        date: `${formattedDate} ${formattedTime}`,
        title: titleInput.value.trim(),
        done: false,
        description: descriptionInput.value.trim()
    };

    if (newTodo.title) {
        todos.push(newTodo);
        await ipcRenderer.invoke('save-todos', todos);
        titleInput.value = '';
        descriptionInput.value = '';
        renderTodos();
    }
}

async function toggleDone(index) {
    todos[index].done = !todos[index].done;
    await ipcRenderer.invoke('save-todos', todos);
    renderTodos();
}

document.getElementById('todoForm').addEventListener('submit', addTodo);
loadTodos();