let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingTaskId = null;
let taskToDelete = null;

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function resetForm() {
  document.getElementById('taskName').value = '';
  document.getElementById('taskDate').value = '';
  document.getElementById('taskPriority').value = 'Low';
  document.querySelector('button[onclick="addTask()"]').innerText = '➕ Add Task';
  editingTaskId = null;
}

function addTask() {
  const name = document.getElementById('taskName').value.trim();
  const date = document.getElementById('taskDate').value;
  const priority = document.getElementById('taskPriority').value;

  if (!name || !date || !priority) {
    alert("Vui lòng nhập đầy đủ thông tin task.");
    return;
  }

  if (editingTaskId !== null) {
    // Cập nhật task đang sửa
    const task = tasks.find(t => t.id === editingTaskId);
    if (task) {
      task.name = name;
      task.date = date;
      task.priority = priority;
    }
  } else {
    // Thêm mới
    const task = {
      id: Date.now(),
      name,
      date,
      priority,
      status: "Pending",
      selected: false
    };
    tasks.push(task);
  }

  saveTasks();
  renderTasks();
  resetForm();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
  
    // Mở modal chỉnh sửa và điền dữ liệu
    document.getElementById('editTaskName').value = task.name;
    document.getElementById('editTaskDate').value = task.date;
    document.getElementById('editTaskPriority').value = task.priority;
  
    editingTaskId = id;
    document.querySelector('.edit-modal').classList.remove('hidden');
  }
  
  function updateTask() {
    const name = document.getElementById('editTaskName').value.trim();
    const date = document.getElementById('editTaskDate').value;
    const priority = document.getElementById('editTaskPriority').value;
  
    if (!name || !date || !priority) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
  
    const task = tasks.find(t => t.id === editingTaskId);
    if (task) {
      task.name = name;
      task.date = date;
      task.priority = priority;
    }
  
    saveTasks();
    renderTasks();
    closeEditModal();
  }
  
  function closeEditModal() {
    document.querySelector('.edit-modal').classList.add('hidden');
    editingTaskId = null;
  }

function confirmDelete(id) {
  taskToDelete = id;
  document.querySelector('.modal').classList.remove('hidden');
}

function deleteTask() {
  tasks = tasks.filter(task => task.id !== taskToDelete);
  saveTasks();
  renderTasks();
  closeModal();
}

function closeModal() {
  document.querySelector('.modal').classList.add('hidden');
  taskToDelete = null;
}

function toggleAll(source) {
  const checkboxes = document.querySelectorAll('input[type="checkbox"].task-checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.checked = source.checked;
    const id = parseInt(checkbox.dataset.id);
    const task = tasks.find(t => t.id === id);
    if (task) task.selected = source.checked;
  });
  saveTasks();
}

function selectAllTasks() {
  tasks.forEach(task => task.selected = true);
  saveTasks();
  renderTasks();
}

function deleteAllTasks() {
  const hasSelected = tasks.some(task => task.selected);
  if (!hasSelected) {
    alert("Bạn chưa chọn task nào.");
    return;
  }
  tasks = tasks.filter(task => !task.selected);
  saveTasks();
  renderTasks();
}

function toggleStatus(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = task.status === 'Pending' ? 'Completed' : 'Pending';
    saveTasks();
    renderTasks();
  }
}

function searchTasks() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const filteredTasks = tasks.filter(task =>
      task.name.toLowerCase().includes(keyword)
    );
  
    renderTasks(filteredTasks);
}
  
function renderTasks(taskListToRender = tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
  
    taskListToRender.forEach(task => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-3"><input type="checkbox" class="task-checkbox" data-id="${task.id}" ${task.selected ? 'checked' : ''} onchange="toggleSelect(${task.id}, this)" /></td>
        <td class="p-3">${task.name}</td>
        <td class="p-3">${task.date}</td>
        <td class="p-3">${task.priority}</td>
        <td class="p-3">
          <span class="${task.status === 'Completed' ? 'text-green-600' : 'text-yellow-500'} cursor-pointer" onclick="toggleStatus(${task.id})">
            ${task.status === 'Completed' ? '✅ Completed' : '⏳ Pending'}
          </span>
        </td>
        <td class="p-3">
          <button onclick="editTask(${task.id})" class="text-blue-500 hover:underline">✏️ Edit</button>
          <button onclick="confirmDelete(${task.id})" class="text-red-500 hover:underline ml-2">🗑️ Delete</button>
        </td>
      `;
      taskList.appendChild(row);
    });
}
  

function toggleSelect(id, checkbox) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.selected = checkbox.checked;
    saveTasks();
  }
}

// Gọi lần đầu
renderTasks();

// Lắng nghe sự kiện nhấn Enter trong các ô input
document.getElementById('taskName').addEventListener('keypress', handleEnterKey);
document.getElementById('taskDate').addEventListener('keypress', handleEnterKey);
document.getElementById('taskPriority').addEventListener('keypress', handleEnterKey);

function handleEnterKey(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTask();
  }
}

