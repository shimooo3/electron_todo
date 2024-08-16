const { ipcRenderer } = require('electron');
const { PythonShell } = require('python-shell')


let todos = [];

async function loadTodos() {
    todos = await ipcRenderer.invoke('get-todos');
    renderTodos();
}

function renderTodos() {
    const notDoneList = document.getElementById('notDoneList');
    const doneList = document.getElementById('doneList');
    notDoneList.innerHTML = '';
    doneList.innerHTML = '';

    todos.forEach((todo, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${todo.date}</td>
      <td>${todo.title}</td>
      <td>
        <button onclick="toggleDone(${index})">${todo.done ? 'Undo' : 'Done'}</button>
        <button onclick="toggleDescription(${index})">Description</button>
      </td>
    `;

        const descriptionRow = document.createElement('tr');
        descriptionRow.innerHTML = `
      <td colspan="3" class="description" style="display: none;">
        <div class="description-text" onclick="makeEditable(this, ${index})">${todo.description}</div>
      </td>
    `;

        if (todo.done) {
            doneList.appendChild(tr);
            doneList.appendChild(descriptionRow);
        } else {
            notDoneList.appendChild(tr);
            notDoneList.appendChild(descriptionRow);
        }
    });
}

async function addTodo(event) {
    event.preventDefault();
    const titleInput = document.getElementById('todoTitle');
    const descriptionInput = document.getElementById('todoDescription');

    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const formattedTime = now.toTimeString().split(' ')[0];

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

function toggleDescription(index) {
    const notDoneList = document.getElementById('notDoneList');
    const doneList = document.getElementById('doneList');

    let targetList = todos[index].done ? doneList : notDoneList;
    let targetIndex = todos.filter(todo => todo.done === todos[index].done).indexOf(todos[index]);

    const rows = targetList.getElementsByTagName('tr');
    if (rows[targetIndex * 2 + 1]) {
        const descriptionRow = rows[targetIndex * 2 + 1].querySelector('.description');
        if (descriptionRow) {
            descriptionRow.style.display = descriptionRow.style.display === 'none' ? 'table-cell' : 'none';
        }
    }
}

function makeEditable(element, index) {
    // 既に編集モードの場合は何もしない
    if (element.querySelector('textarea')) {
        return;
    }

    const currentText = element.innerText;
    element.innerHTML = `
    <textarea rows="3" cols="50">${currentText}</textarea>
    <button onclick="saveDescription(this, ${index})">Save</button>
  `;

    const textarea = element.querySelector('textarea');
    textarea.focus();
    textarea.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            saveDescription(this.nextElementSibling, index);
        }
    });

    // クリックイベントの伝播を停止
    element.onclick = (event) => {
        event.stopPropagation();
    };
}

async function saveDescription(button, index) {
    const textarea = button.previousElementSibling || button;
    const newDescription = textarea.value.trim();
    todos[index].description = newDescription;
    await ipcRenderer.invoke('save-todos', todos);
    renderTodos();
}
document.getElementById('sendEmailButton').addEventListener('click', async () => {
    const response = await ipcRenderer.invoke('send_email', todos);
    console.log(response);
});
document.getElementById('todoForm').addEventListener('submit', addTodo);
loadTodos();