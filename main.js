let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let deleteIndex = null; // Lưu index để xoá khi xác nhận

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filterKeyword = "", filterPriority = "All") {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks
    .filter(task => {
      const matchKeyword = task.name.toLowerCase().includes(filterKeyword.toLowerCase());
      const matchPriority = filterPriority === "All" || task.priority === filterPriority;
      return matchKeyword && matchPriority;
    })
    .forEach((task, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="checkbox" onchange="toggleComplete(${index})" ${task.completed ? "checked" : ""}></td>
        <td class="${task.completed ? 'line-through text-gray-400' : ''}">${task.name}</td>
        <td>${task.date}</td>
        <td>${task.priority}</td>
        <td>${task.completed ? "✅ Done" : "⏳ Pending"}</td>
        <td>
          <button onclick="deleteTask(${index})" class="text-red-500 hover:underline">🗑️ Delete</button>
        </td>
      `;
      taskList.appendChild(row);
    });
}

function addTask() {
  const name = document.getElementById("taskName").value.trim();
  const date = document.getElementById("taskDate").value;
  const priority = document.getElementById("taskPriority").value;

  if (!name || !date) {
    alert("Please enter task name and date.");
    return;
  }

  tasks.push({ name, date, priority, completed: false });
  saveTasks();
  renderTasks();
  document.getElementById("taskName").value = "";
  document.getElementById("taskDate").value = "";
  document.getElementById("taskPriority").value = "Low";
}

function deleteTask(index) {
  deleteIndex = index;
  document.getElementById("confirmModal").classList.remove("hidden");
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function selectAllTasks() {
  tasks.forEach(task => task.completed = true);
  saveTasks();
  renderTasks();
}

function deleteAllTasks() {
  if (confirm("Delete all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

function searchTasks() {
  const keyword = document.getElementById("searchInput").value;
  const priority = document.getElementById("filterPriority").value;
  renderTasks(keyword, priority);
}

document.addEventListener("DOMContentLoaded", () => {
  renderTasks();


  document.getElementById("confirmYes").addEventListener("click", () => {
    if (deleteIndex !== null) {
      tasks.splice(deleteIndex, 1);
      saveTasks();
      renderTasks();
      deleteIndex = null;
    }
    document.getElementById("confirmModal").classList.add("hidden");
  });

  document.getElementById("confirmCancel").addEventListener("click", () => {
    deleteIndex = null;
    document.getElementById("confirmModal").classList.add("hidden");
  });
});
