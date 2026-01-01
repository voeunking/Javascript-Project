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

let notLogin = document.getElementById('notLoing');
console.log(notLogin)
let notLogin = document.querySelector('.link span a');
let register = document.querySelector('.register-container')
let login = document.getElementById('login');
let re_form = document.getElementById('re-form');

// Check login status on page load
window.addEventListener('load', function () {
    if (isLoggedIn()) {
        // User is logged in, show dashboard
        let main = document.getElementById('main');
        main.style.display = 'block';
        login.style.display = 'none';
        register.style.display = 'none';

        // Update user info in dashboard if needed
        const currentUser = getCurrentUser();
        if (currentUser) {
            console.log('Welcome back:', currentUser.fullName);
        }
    } else {
        // User not logged in, show registration form by default
        register.style.display = 'block';
        login.style.display = 'none';
    }
});

// login
function display() {
    login.style.display = 'block';
    register.style.display = 'none';
}
notLogin.addEventListener('click', display)
// register
function show_regist() {
    login.style.display = 'none';
    register.style.display = 'block'
}
re_form.addEventListener('click', show_regist)

// GO TO DASHBORD
let register_button = document.getElementById('register-login')
register_button.addEventListener('click', function (e) {
    e.preventDefault(); // Prevent form submission

    // Get registration form inputs
    const inputs = document.querySelectorAll('.register-container input[name="inputText"]');
    const userData = {
        fullName: inputs[0]?.value || '',
        email: inputs[1]?.value || '',
        password: inputs[2]?.value || '',
        confirmPassword: inputs[3]?.value || '',
        phoneNumber: inputs[4]?.value || ''
    };

    // Validate registration data
    if (!userData.fullName || !userData.email || !userData.password || !userData.confirmPassword) {
        
          Swal.fire({
            icon: "error",
            title: "",
            text: "Please fill in all required fields!",
            footer: '<a href="#">Why do I have this issue?</a>'
        });
        return;
    }

    if (userData.password !== userData.confirmPassword) {
         Swal.fire({
            icon: "error",
            title: "",
            text: "Passwords do not match",
            footer: '<a href="#">Why do I have this issue?</a>'
        });
        return;
    }
    // Store user data in local storage
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log('User data stored:', userData);
    // Show dashboard
    let main = document.getElementById('main');
    main.style.display = 'block';
    register.style.display = 'none';

})
// Login functionality
let loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Retrieve stored user data
    const storedUserData = localStorage.getItem('userData');

    if (!storedUserData) {
         Swal.fire({
            icon: "error",
            title: "",
            text: "No user found. Please register first!",
            footer: '<a href="#">Why do I have this issue?</a>'
        });
        return;
    }

    const userData = JSON.parse(storedUserData);

    // Validate login credentials
    if (userData.email === email && userData.password === password) {
        // Store login session
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
            fullName: userData.fullName,
            email: userData.email,
            phoneNumber: userData.phoneNumber
        }));

        Swal.fire({
            title: "You have been has account!",
            icon: "success",
            draggable: true
        });

        // Show dashboard
        let main = document.getElementById('main');
        main.style.display = 'block';
        login.style.display = 'none';
    } else {
        Swal.fire({
            icon: "error",
            title: "",
            text: "Invalid email or password!",
            footer: '<a href="#">Why do I have this issue?</a>'
        });
        
    }
});

// Logout functionality
let logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', function () {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');

    // Show login form
    let main = document.getElementById('main');
    let loginForm = document.getElementById('login');
    main.style.display = 'none';
    loginForm.style.display = 'block';

    console.log('Logged out successfully');
});

// Function to get stored user data
function getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

<<<<<<< HEAD
register.addEventListener('click',display)
=======
// Function to get current user session
function getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

// Function to check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}
// Function to clear all stored data
function clearAllData() {
    localStorage.clear();
    console.log('All local storage data cleared');
}
// incorrect
let logo = document.querySelector('.logo')
logo.addEventListener('click', function () {
    let input = document.getElementsByName('inputText');
    console.log(input.value)
})
// for (let Input of input){
//     console.log(Input.value)
// }
>>>>>>> 0040ba0fbd4bdca1c03fa3396d3fab9052b808d8
