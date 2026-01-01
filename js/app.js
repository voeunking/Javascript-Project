//task-filter- tasks.js

let tasks = [
  { title: "Finish report", category: "Work", priority: "High", status: "Pending" }
];

const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category");
const priorityFilter = document.getElementById("priority");
const statusFilter = document.getElementById("status");
const addBtn = document.querySelector(".add");


function renderTasks(filteredTasks = tasks) {
  taskList.innerHTML = ""; // Clear previous

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");


    const title = document.createElement("h4");
    title.textContent = task.title;
    li.appendChild(title);


    const details = document.createElement("p");
    details.style.fontSize = "13px";
    details.style.color = "#555";
    details.style.marginTop = "4px";
    details.textContent = `Category: ${task.category} | Priority: ${task.priority} | Status: ${task.status}`;
    li.appendChild(details);

    const btnGroup = document.createElement("div");
    btnGroup.className = "button-group";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit";
    editBtn.onclick = () => editTask(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete";
    deleteBtn.onclick = () => deleteTask(index);

    const detailBtn = document.createElement("button");
    detailBtn.textContent = "Details";
    detailBtn.className = "soacetis";
    detailBtn.onclick = () => showDetails(task);

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);
    btnGroup.appendChild(detailBtn);

    li.appendChild(btnGroup);
    taskList.appendChild(li);
  });
}


function filterTasks() {
  const searchText = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const priority = priorityFilter.value;
  const status = statusFilter.value;

  const filtered = tasks.filter(task => {
    return (
      task.title.toLowerCase().includes(searchText) &&
      (category === "" || task.category === category) &&
      (priority === "" || task.priority === priority) &&
      (status === "" || task.status === status)
    );
  });

  renderTasks(filtered);
}


addBtn.onclick = () => {
  const title = prompt("Enter task title:");
  const category = prompt("Enter category (Work / Personal / Study):");
  const priority = prompt("Enter priority (Low / Medium / High):");
  const status = prompt("Enter status (Pending / Completed):");

  if (title) {
    tasks.push({ title, category, priority, status });
    renderTasks();
  }
};


function editTask(index) {
  const task = tasks[index];
  const newTitle = prompt("Edit task title:", task.title);
  const newCategory = prompt("Edit category:", task.category);
  const newPriority = prompt("Edit priority:", task.priority);
  const newStatus = prompt("Edit status:", task.status);

  if (newTitle) {
    tasks[index] = { title: newTitle, category: newCategory, priority: newPriority, status: newStatus };
    renderTasks();
  }
}


function deleteTask(index) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.splice(index, 1);
    renderTasks();
  }
}


function showDetails(task) {
  alert(`Title: ${task.title}\nCategory: ${task.category}\nPriority: ${task.priority}\nStatus: ${task.status}`);
}

renderTasks();
