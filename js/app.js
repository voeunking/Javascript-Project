// Tage (Tags) Manager
let tags = JSON.parse(localStorage.getItem('tags')) || ['Urgent', 'Important', 'Review'];

function showAddTagForm() {
    const addForm = document.getElementById('addTagForm');
    const tagsList = document.getElementById('tagsList');

    if (addForm.style.display === 'none' || addForm.style.display === '') {
        addForm.style.display = 'block';
        tagsList.style.display = 'none';
    } else {
        addForm.style.display = 'none';
        tagsList.style.display = 'block';
    }
}

function initializeTags() {
    renderTags();
}

function addTag() {
    const input = document.getElementById('tagInput');
    const tagName = input.value.trim();

    if (tagName === '') {
        Swal.fire({
            icon: "error",
            title: "Missing Tag",
            text: "Please enter a tag name"
        });
        return;
    }

    if (tags.includes(tagName)) {
        Swal.fire({
            icon: "error",
            title: "Tag Exists",
            text: "This tag already exists"
        });
        return;
    }

    tags.push(tagName);
    localStorage.setItem('tags', JSON.stringify(tags));
    renderTags();
    input.value = '';

    Swal.fire({
        icon: "success",
        title: "Tag Added!",
        text: `"${tagName}" has been added`,
        timer: 2000,
        showConfirmButton: false
    });
}

function editTag(oldName) {
    const newName = prompt(`Edit tag "${oldName}":`, oldName);

    if (newName === null || newName.trim() === '') {
        return;
    }

    if (newName.trim() === oldName) {
        return;
    }

    if (tags.includes(newName.trim())) {
        Swal.fire({
            icon: "error",
            title: "Tag Exists",
            text: "This tag already exists"
        });
        return;
    }

    const index = tags.indexOf(oldName);
    tags[index] = newName.trim();
    localStorage.setItem('tags', JSON.stringify(tags));
    renderTags();

    Swal.fire({
        icon: "success",
        title: "Tag Updated!",
        text: `Tag has been updated`,
        timer: 2000,
        showConfirmButton: false
    });
}

function deleteTag(name) {
    const taskCount = tasks.filter(task => task.tags && task.tags.includes(name)).length;

    if (taskCount > 0) {
        Swal.fire({
            title: "Cannot Delete Tag",
            text: `This tag is used by ${taskCount} task(s). Please remove tag from tasks first.`,
            icon: "warning"
        });
        return;
    }

    Swal.fire({
        title: "Delete Tag?",
        text: `Are you sure you want to delete "${name}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            tags = tags.filter(tag => tag !== name);
            localStorage.setItem('tags', JSON.stringify(tags));
            renderTags();

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: `Tag "${name}" has been deleted.`,
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}

function renderTags() {
    const tagsList = document.getElementById('tagsList');
    if (!tagsList) return;

    tagsList.innerHTML = '';

    tags.forEach((tag, index) => {
        const color = colors[index % colors.length];
        const taskCount = tasks.filter(task => task.tags && task.tags.includes(tag)).length;

        const tagElement = document.createElement('div');
        tagElement.className = 'category-item';
        tagElement.setAttribute('data-tag', tag);

        tagElement.innerHTML = `
            <div class="category-info">
                <div class="category-dot ${color}"></div>
                <span class="category-name">${tag}</span>
                <span class="task-count">(${taskCount} tasks)</span>
            </div>
            <div class="category-actions">
                <button onclick="editTag('${tag}')" class="btn-edit">Edit</button>
                <button onclick="deleteTag('${tag}')" class="btn-delete" ${taskCount > 0 ? 'disabled title="Cannot delete tag with tasks"' : ''}>Delete</button>
            </div>
        `;

        tagsList.appendChild(tagElement);
    });

    localStorage.setItem('tags', JSON.stringify(tags));
}

// Categories Manager JavaScript

let categories = JSON.parse(localStorage.getItem('categories')) || ['Work', 'Personal', 'Study'];
let taskChart = null;
const colors = ['blue', 'green', 'purple', 'red', 'yellow', 'indigo', 'pink', 'gray'];

// Initialize chart when page loads
document.addEventListener('DOMContentLoaded', function () {
    initializeChart();
    updateTaskStats();
    renderCategories(); // Initialize categories display
    initializeTags(); // Initialize tags display
});

function initializeChart() {
    const ctx = document.getElementById('taskChart');
    if (!ctx) return;

    taskChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Task', 'Completed', 'Pending', "Today's Task"],
            datasets: [{
                label: 'Task Statistics',
                data: [0, 0, 0, 0],
                backgroundColor: [
                    'rgba(17, 0, 255, 0.677)',
                    'rgba(1, 163, 42, 0.7)',
                    'rgba(220, 185, 6, 0.729)',
                    'rgba(0, 128, 128, 0.7)'
                ],
                borderColor: [
                    'rgba(17, 0, 255, 1)',
                    'rgba(1, 163, 42, 1)',
                    'rgba(220, 185, 6, 1)',
                    'rgba(0, 128, 128, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Task Overview',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    color: '#333'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

function updateChart() {
    if (!taskChart) return;

    const totalTasks = parseInt(document.querySelector('.element1 .num').textContent) || 0;
    const completedTasks = parseInt(document.querySelector('.element2 .num').textContent) || 0;
    const pendingTasks = parseInt(document.querySelector('.element3 .num').textContent) || 0;
    const todayTasks = parseInt(document.querySelector('.element4 .num').textContent) || 0;

    taskChart.data.datasets[0].data = [totalTasks, completedTasks, pendingTasks, todayTasks];
    taskChart.update();
}

function updateTaskStats() {
    // Get tasks from localStorage or use default values
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
    const todayTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt).toDateString();
        const today = new Date().toDateString();
        return taskDate === today;
    }).length;

    // Update the statistics cards
    document.querySelector('.element1 .num').textContent = totalTasks;
    document.querySelector('.element2 .num').textContent = completedTasks;
    document.querySelector('.element3 .num').textContent = pendingTasks;
    document.querySelector('.element4 .num').textContent = todayTasks;

    // Update the chart
    updateChart();
}

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function addCategory() {
    const input = document.getElementById('categoryInput');
    const categoryName = input.value.trim();

    if (categoryName === '') {
        showMessage('Please enter a category name', 'error');
        return;
    }

    if (categories.includes(categoryName)) {
        showMessage('Category already exists', 'error');
        return;
    }

    categories.push(categoryName);
    renderCategories();
    input.value = '';
    showMessage('Category added successfully', 'success');
}

function editCategory(oldName) {
    const newName = prompt(`Edit category "${oldName}":`, oldName);

    if (newName === null || newName.trim() === '') {
        return;
    }

    if (newName.trim() === oldName) {
        return;
    }

    if (categories.includes(newName.trim())) {
        showMessage('Category already exists', 'error');
        return;
    }

    const index = categories.indexOf(oldName);
    categories[index] = newName.trim();
    renderCategories();
    showMessage('Category updated successfully', 'success');
}

function deleteCategory(name) {
    const taskCount = tasks.filter(task => task.category === name).length;

    if (taskCount > 0) {
        Swal.fire({
            title: "Cannot Delete Category",
            text: `This category has ${taskCount} task(s). Please move or delete the tasks first.`,
            icon: "warning",
            confirmButtonColor: "#3085d6"
        });
        return;
    }

    Swal.fire({
        title: "Delete Category?",
        text: `Are you sure you want to delete "${name}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            categories = categories.filter(cat => cat !== name);
            localStorage.setItem('categories', JSON.stringify(categories));
            renderCategories();

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: `Category "${name}" has been deleted.`,
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}

function renderCategories() {
    const categoriesList = document.getElementById('categoriesList');
    if (!categoriesList) return;

    categoriesList.innerHTML = '';

    categories.forEach((category, index) => {
        const color = colors[index % colors.length];
        const taskCount = tasks.filter(task => task.category === category).length;

        const categoryElement = document.createElement('div');
        categoryElement.className = 'category-item';
        categoryElement.setAttribute('data-category', category);

        categoryElement.innerHTML = `
            <div class="category-info">
                <div class="category-dot ${color}"></div>
                <span class="category-name">${category}</span>
                <span class="task-count">(${taskCount} tasks)</span>
            </div>
            <div class="category-actions">
                <button onclick="editCategory('${category}')" class="btn-edit">Edit</button>
                <button onclick="deleteCategory('${category}')" class="btn-delete" ${taskCount > 0 ? 'disabled title="Cannot delete category with tasks"' : ''}>Delete</button>
            </div>
        `;

        categoriesList.appendChild(categoryElement);
    });

    // Save categories to localStorage
    localStorage.setItem('categories', JSON.stringify(categories));
}

function showMessage(message, type) {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Handle Enter key in input field
document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('categoryInput');
    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addCategory();
        }
    });

    // Initialize categories display
    renderCategories();
});

// Add click handlers for navigation tabs
document.addEventListener('DOMContentLoaded', function () {
    const navTabs = document.querySelectorAll('.nav-tab');

    navTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Remove active class from all tabs
            navTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
        });
    });

    // Add click handler for the main Add button
    const addBtn = document.querySelector('.add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', function () {
            // Focus on the input field
            document.getElementById('categoryInput').focus();
        });
    }
});
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
    let name = document.getElementById('name');
    let show_imails = document.getElementById('displayEmail');
    let show_passwords = document.getElementById('displayPassword');
    let show_names = document.getElementById('displayName');
    show_names.textContent = userData.fullName
    show_imails.textContent = userData.email;
    show_passwords.textContent = userData.password;
    name.textContent = userData.fullName;
    login.style.display = 'block';
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

// all feature
let main_1_top = document.querySelector('.main-1-top')
let show_tage = document.querySelector('.tage');
let show_task = document.getElementById('task');
let show_categories = document.getElementById('category');
let show_profile = document.getElementById('profile');
let active = document.getElementById('active');
let chart = document.getElementById('chart');
let setting = document.getElementById('setting');
// dashbord 
active.addEventListener('click', function () {
    main_1_top.style.display = '';
    show_tage.style.display = 'none';
    show_task.style.display = 'none';
    tage.style.background = 'none';
    active.style.background = '#b3b1d326';
    taskss.style.background = 'none';
    show_categories.style.background = 'none';
    categoriesList.style.display = 'none';
    chart.style.display = 'block';
    active.style.borderRadius = '10px';
    show_profile.style.background = 'none';
    profile.style.display = 'none';
     show_setting.style.display = 'none';
    setting.style.background = 'none';
})

// Tage
let tage = document.getElementById('tag');
tage.addEventListener('click', function () {

    show_tage.style.display = 'block';
  tage.style.borderRadius = '10px';
    main_1_top.style.display = 'none';
    show_task.style.display = 'none';
    tage.style.background = '#b3b1d326';
    active.style.background = 'none';
    taskss.style.background = 'none';
    show_categories.style.background = 'none';
    categoriesList.style.display = 'none';
    chart.style.display = 'none';
    show_profile.style.background = 'none';
    profile.style.display = 'none';
     show_setting.style.display = 'none';
    setting.style.background = 'none';

    // Initialize tags display
    initializeTags();
})
// task
let taskss = document.getElementById('tasks');
taskss.addEventListener('click', function () {
    show_task.style.display = 'block'
  taskss.style.borderRadius = '10px';
    main_1_top.style.display = 'none';
    show_tage.style.display = 'none'
    taskss.style.background = '#b3b1d326';
    active.style.background = 'none';
    tage.style.background = 'none';
    show_categories.style.background = 'none';
    categoriesList.style.display = 'none';
    chart.style.display = 'none';
    show_profile.style.background = 'none';
    profile.style.display = 'none';
     show_setting.style.display = 'none';
    setting.style.background = 'none';

})
// categories
let categoriesList = document.getElementById('categories-list');
show_categories.addEventListener('click', function () {
    show_task.style.display = 'none'
    main_1_top.style.display = 'none';
    show_tage.style.display = 'none'
    show_categories.style.background = '#b3b1d326';
    active.style.background = 'none';
    tage.style.background = 'none';
    taskss.style.background = 'none';
    categoriesList.style.display = 'block';
    show_categories.style.borderRadius = '10px';
    chart.style.display = 'none';
    show_profile.style.background = 'none';
    profile.style.display = 'none';
     show_setting.style.display = 'none';
    setting.style.background = 'none';

})

// profile
let profile = document.getElementById('profiles');
show_profile.addEventListener('click', function () {
    show_task.style.display = 'none'
    main_1_top.style.display = 'none';
    show_tage.style.display = 'none'
    show_categories.style.background = 'none';
    show_profile.style.background = '#b3b1d326';
    active.style.background = 'none';
    tage.style.background = 'none';
    taskss.style.background = 'none';
    categoriesList.style.display = 'none';
    chart.style.display = 'none';
    profile.style.display = 'block';
    show_profile.style.borderRadius = '10px';
    show_setting.style.display = 'none';
    setting.style.background = 'none';

})

// setting
let show_setting =document.getElementById('settings-section');
setting.addEventListener('click',function(){
    show_setting.style.display = 'block';
    setting.style.background = '#b3b1d326';
    setting.style.borderRadius = '10px';
    show_task.style.display = 'none'
    main_1_top.style.display = 'none';
    show_tage.style.display = 'none'
    show_categories.style.background = 'none';
    show_profile.style.background = 'none';
    active.style.background = 'none';
    tage.style.background = 'none';
    taskss.style.background = 'none';
    categoriesList.style.display = 'none';
    chart.style.display = 'none';
    profile.style.display = 'none';
})

// function task
let tasks = JSON.parse(localStorage.getItem('tasks')) || [
    ''
];

// Initialize filters and render tasks when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initial render of all tasks
    renderTasks();
    updateTaskStats();
});

const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category");
const priorityFilter = document.getElementById("priority");
const statusFilter = document.getElementById("status");
const addBtn = document.querySelector(".btn-add .add");


function renderTasks(filteredTasks = tasks) {
    taskList.innerHTML = ""; // Clear previous

    // Save tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));

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
        detailBtn.textContent = "Completed";
        detailBtn.className = "soacetis";
        detailBtn.onclick = () => markAsCompleted(index);

        btnGroup.appendChild(editBtn);
        btnGroup.appendChild(deleteBtn);
        btnGroup.appendChild(detailBtn);

        li.appendChild(btnGroup);
        taskList.appendChild(li);
    });
}


function filterTasks() {
    try {
        const searchText = searchInput ? searchInput.value.toLowerCase() : '';
        const category = categoryFilter ? categoryFilter.value : '';
        const priority = priorityFilter ? priorityFilter.value : '';
        const status = statusFilter ? statusFilter.value : '';

        console.log('Filtering tasks:', { searchText, category, priority, status });

        const filtered = tasks.filter(task => {
            const titleMatch = task.title.toLowerCase().includes(searchText);
            const categoryMatch = category === "" || task.category === category;
            const priorityMatch = priority === "" || task.priority === priority;
            const statusMatch = status === "" || task.status === status;

            return titleMatch && categoryMatch && priorityMatch && statusMatch;
        });

        console.log('Filtered tasks:', filtered);
        renderTasks(filtered);
    } catch (error) {
        console.error('Error in filterTasks:', error);
        renderTasks(tasks); // Fallback to show all tasks
    }
}


addBtn.onclick = () => {
    Swal.fire({
        title: 'Add New Task',
        html: `
            <div style="text-align: left;">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 60; font-size:14px;">Task Title:</label>
                    <input id="swal-title" class="swal2-input" placeholder="Enter task title" style="font-size:14px; border-radius: 5px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 60;font-size:14px;">Category:</label>
                    <select id="swal-category" class="swal2-select" style="font-size:14px; border-radius: 5px;">
                        <option value="">Select category</option>
                        ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                    </select>
                </div>
                <div style="margin-bottom: 15px;" font-size:14px;>
                    <label style="display: block; margin-bottom: 5px; font-weight: 60;font-size:14px;" >Priority:</label>
                    <select id="swal-priority" class="swal2-select" style="font-size:14px; border-radius: 5px;">
                        <option value="">Select priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 60;font-size:14px;">Status:</label>
                    <select id="swal-status" class="swal2-select" style="font-size:14px; border-radius: 5px;"> 
                        <option value="">Select status</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div style="margin-bottom: 15px; ">
                    <label style="display: block; margin-bottom: 5px; font-weight: 60;font-size:14px;">Tags (comma separated):</label>
                    <input id="swal-tags" class="swal2-input" placeholder="e.g., urgent, important, review" style="font-size:14px; border-radius: 5px;">
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Add Task',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
            const title = document.getElementById('swal-title').value.trim();
            const category = document.getElementById('swal-category').value;
            const priority = document.getElementById('swal-priority').value;
            const status = document.getElementById('swal-status').value;
            const selectedTags = document.getElementById('swal-tags').value.trim();

            if (!title) {
                Swal.showValidationMessage('Please enter a task title');
                return false;
            }
            if (!category) {
                Swal.showValidationMessage('Please select a category');
                return false;
            }
            if (!priority) {
                Swal.showValidationMessage('Please select a priority');
                return false;
            }
            if (!status) {
                Swal.showValidationMessage('Please select a status');
                return false;
            }

            return { title, category, priority, status, selectedTags };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { title, category, priority, status, selectedTags } = result.value;
            const tagArray = selectedTags ? selectedTags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

            const newTask = {
                title,
                category,
                priority,
                status,
                tags: tagArray,
                createdAt: new Date().toISOString(),
                id: Date.now() // Unique ID for each task
            };

            tasks.push(newTask);

            // Add category to categories list if it doesn't exist
            if (!categories.includes(category)) {
                categories.push(category);
                localStorage.setItem('categories', JSON.stringify(categories));
                renderCategories(); // Update categories display
            }

            // Add new tags to tags list if they don't exist
            tagArray.forEach(tag => {
                if (!tags.includes(tag)) {
                    tags.push(tag);
                    localStorage.setItem('tags', JSON.stringify(tags));
                }
            });

            renderTasks();
            updateTaskStats();
            renderTags(); // Update tags display

            // Show success message
            Swal.fire({
                icon: "success",
                title: "Task Added!",
                text: `"${title}" has been added to ${category}${tagArray.length > 0 ? ` with tags: ${tagArray.join(', ')}` : ''}`,
                timer: 3000,
                showConfirmButton: false
            });
        }
    });
};


function editTask(index) {
    const task = tasks[index];
    const newTitle = prompt("Edit task title:", task.title);
    const newCategory = prompt("Edit category:", task.category);
    const newPriority = prompt("Edit priority:", task.priority);
    const newStatus = prompt("Edit status:", task.status);
    const currentTags = task.tags ? task.tags.join(', ') : '';
    const newTags = prompt("Edit tags (comma separated):", currentTags);

    if (newTitle && newCategory && newPriority && newStatus) {
        const oldCategory = task.category;
        const oldTags = task.tags || [];
        const newTagArray = newTags ? newTags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

        // Update task
        tasks[index] = {
            title: newTitle,
            category: newCategory,
            priority: newPriority,
            status: newStatus,
            tags: newTagArray,
            createdAt: task.createdAt,
            id: task.id
        };

        // Handle category changes
        if (oldCategory !== newCategory) {
            // Remove old category if no tasks left
            const tasksInOldCategory = tasks.filter(t => task.category === oldCategory);
            if (tasksInOldCategory.length === 0) {
                categories = categories.filter(cat => cat !== oldCategory);
                localStorage.setItem('categories', JSON.stringify(categories));
            }

            // Add new category if it doesn't exist
            if (!categories.includes(newCategory)) {
                categories.push(newCategory);
                localStorage.setItem('categories', JSON.stringify(categories));
            }

            renderCategories(); // Update categories display
        }

        // Handle tag changes
        oldTags.forEach(tag => {
            const tasksWithTag = tasks.filter(t => t.tags && t.tags.includes(tag));
            if (tasksWithTag.length === 0) {
                tags = tags.filter(t => t !== tag);
                localStorage.setItem('tags', JSON.stringify(tags));
            }
        });

        newTagArray.forEach(tag => {
            if (!tags.includes(tag)) {
                tags.push(tag);
                localStorage.setItem('tags', JSON.stringify(tags));
            }
        });

        renderTasks();
        updateTaskStats();
        renderTags(); // Update tags display

        // Show success message
        Swal.fire({
            icon: "success",
            title: "Task Updated!",
            text: `"${newTitle}" has been updated${newTagArray.length > 0 ? ` with tags: ${newTagArray.join(', ')}` : ''}`,
            timer: 3000,
            showConfirmButton: false
        });
    }
}


function deleteTask(index) {
    const task = tasks[index];

    Swal.fire({
        title: "Delete Task?",
        text: `Are you sure you want to delete "${task.title}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            const deletedCategory = task.category;
            const deletedTags = task.tags || [];

            // Remove task
            tasks.splice(index, 1);

            // Check if category should be removed
            const tasksInCategory = tasks.filter(t => task.category === deletedCategory);
            if (tasksInCategory.length === 0) {
                categories = categories.filter(cat => cat !== deletedCategory);
                localStorage.setItem('categories', JSON.stringify(categories));
                renderCategories(); // Update categories display
            }

            // Check if tags should be removed
            deletedTags.forEach(tag => {
                const tasksWithTag = tasks.filter(t => t.tags && t.tags.includes(tag));
                if (tasksWithTag.length === 0) {
                    tags = tags.filter(t => t !== tag);
                    localStorage.setItem('tags', JSON.stringify(tags));
                }
            });

            renderTasks();
            updateTaskStats();
            renderTags(); // Update tags display

            // Show success message
            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: `"${task.title}" has been deleted.`,
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}


function markAsCompleted(index) {
    const task = tasks[index];

    if (task.status === 'Completed') {
        Swal.fire({
            title: "Already Completed",
            text: `"${task.title}" is already marked as completed.`,
            icon: "info",
            timer: 2000,
            showConfirmButton: false
        });
        return;
    }

    Swal.fire({
        title: "Mark as Completed?",
        text: `Are you sure you want to mark "${task.title}" as completed?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, complete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            // Update task status
            tasks[index].status = 'Completed';

            // Save and update
            renderTasks();
            updateTaskStats();

            // Show success message
            Swal.fire({
                icon: "success",
                title: "Task Completed!",
                text: `"${task.title}" has been marked as completed.`,
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}

function showDetails(task) {
    let details = `Title: ${task.title}\nCategory: ${task.category}\nPriority: ${task.priority}\nStatus: ${task.status}`;

    if (task.tags && task.tags.length > 0) {
        details += `\nTags: ${task.tags.join(', ')}`;
    }

    if (task.createdAt) {
        const createdDate = new Date(task.createdAt).toLocaleDateString();
        details += `\nCreated: ${createdDate}`;
    }

    alert(details);
}

renderTasks();



// profile
function editProfile() {
    document.getElementById("viewProfile").classList.add("hidden");
    document.getElementById("editProfileForm").classList.remove("hidden");
}

function togglePassword() {
    const passwordInput = document.getElementById("passwordInput");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}

function saveProfile() {
    const name = document.getElementById("nameInput").value;
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;

    document.getElementById("displayName").innerText = name;
    document.getElementById("displayEmail").innerText = email;

    // 🔒 Always hide password after save
    document.getElementById("displayPassword").innerText = "*".repeat(password.length);

    // Reset password input to hidden
    document.getElementById("passwordInput").type = "password";

    document.getElementById("editProfileForm").classList.add("hidden");
    document.getElementById("viewProfile").classList.remove("hidden");
    document.getElementById("editProfileForm").style.display = 'none';
    Swal.fire({
        icon: "success",
        title: "You have already change!",
        timer: 3000,
        showConfirmButton: false
    });

}
let show_updet = document.getElementById('editProfileForm');
let use_updet = document.getElementById('edit');
use_updet.addEventListener('click', function () {
    show_updet.style.display = 'block'
})



// setting

// Settings State Management
let settingsState = {
    appearance: {
        theme: 'light',
        colorScheme: 'purple',
        fontSize: 'medium'
    },
    taskManagement: {
        defaultPriority: 'Medium',
        autoCategorize: false,
        showCompleted: true
    },
    dataPrivacy: {
        autoBackup: false,
        exportFormat: 'json'
    },
    notifications: {
        emailNotifications: true,
        taskReminders: true,
        weeklyReport: false
    }
};

// Initialize Settings
function initializeSettings() {
    loadSettingsFromStorage();
    setupSettingsEventListeners();
    applySettingsToUI();
}

// Load settings from localStorage
function loadSettingsFromStorage() {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
        settingsState = { ...settingsState, ...JSON.parse(savedSettings) };
    }
}

// Save settings to localStorage
function saveSettingsToStorage() {
    localStorage.setItem('appSettings', JSON.stringify(settingsState));
}

// Setup Settings Event Listeners
function setupSettingsEventListeners() {
    // Appearance Settings
    setupAppearanceListeners();
    
    // Task Management Settings
    setupTaskManagementListeners();
    
    // Data & Privacy Settings
    setupDataPrivacyListeners();
    
    // Save button
    const saveBtn = document.querySelector('[onclick="saveSettings()"]');
    if (saveBtn) {
        saveBtn.onclick = saveSettings;
    }
}

// Setup Appearance Listeners
function setupAppearanceListeners() {
    // Theme selector
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.value = settingsState.appearance.theme;
        themeSelect.addEventListener('change', (e) => {
            settingsState.appearance.theme = e.target.value;
            applyTheme(e.target.value);
        });
    }

    // Color scheme selector
    const colorSchemeSelect = document.getElementById('color-scheme');
    if (colorSchemeSelect) {
        colorSchemeSelect.value = settingsState.appearance.colorScheme;
        colorSchemeSelect.addEventListener('change', (e) => {
            settingsState.appearance.colorScheme = e.target.value;
            applyColorScheme(e.target.value);
        });
    }

    // Font size selector (if exists)
    const fontSizeSelect = document.getElementById('font-size');
    if (fontSizeSelect) {
        fontSizeSelect.value = settingsState.appearance.fontSize;
        fontSizeSelect.addEventListener('change', (e) => {
            settingsState.appearance.fontSize = e.target.value;
            applyFontSize(e.target.value);
        });
    }
}

// Setup Task Management Listeners
function setupTaskManagementListeners() {
    // Default priority selector
    const defaultPrioritySelect = document.getElementById('default-priority');
    if (defaultPrioritySelect) {
        defaultPrioritySelect.value = settingsState.taskManagement.defaultPriority;
        defaultPrioritySelect.addEventListener('change', (e) => {
            settingsState.taskManagement.defaultPriority = e.target.value;
        });
    }

    // Auto-categorize toggle
    const autoCategorizeToggle = document.getElementById('auto-categorize');
    if (autoCategorizeToggle) {
        autoCategorizeToggle.checked = settingsState.taskManagement.autoCategorize;
        autoCategorizeToggle.addEventListener('change', (e) => {
            settingsState.taskManagement.autoCategorize = e.target.checked;
        });
    }

    // Show completed tasks toggle
    const showCompletedToggle = document.getElementById('show-completed');
    if (showCompletedToggle) {
        showCompletedToggle.checked = settingsState.taskManagement.showCompleted;
        showCompletedToggle.addEventListener('change', (e) => {
            settingsState.taskManagement.showCompleted = e.target.checked;
            filterTasks(); // Re-filter tasks when this changes
        });
    }
}

// Setup Data & Privacy Listeners
function setupDataPrivacyListeners() {
    // Auto backup toggle
    const autoBackupToggle = document.getElementById('auto-backup');
    if (autoBackupToggle) {
        autoBackupToggle.checked = settingsState.dataPrivacy.autoBackup;
        autoBackupToggle.addEventListener('change', (e) => {
            settingsState.dataPrivacy.autoBackup = e.target.checked;
            if (e.target.checked) {
                enableAutoBackup();
            } else {
                disableAutoBackup();
            }
        });
    }

    // Export data button
    const exportBtn = document.querySelector('[onclick="exportData()"]');
    if (exportBtn) {
        exportBtn.onclick = exportData;
    }

    // Clear all data button
    const clearBtn = document.querySelector('[onclick="clearAllData()"]');
    if (clearBtn) {
        clearBtn.onclick = clearAllData;
    }
}

// Apply Theme
function applyTheme(theme) {
    const body = document.body;
    body.classList.remove('theme-light', 'theme-dark', 'theme-auto');
    
    if (theme === 'dark') {
        body.classList.add('theme-dark');
    } else if (theme === 'light') {
        body.classList.add('theme-light');
    } else {
        // Auto theme based on system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
    }
}

// Apply Color Scheme
function applyColorScheme(colorScheme) {
    const body = document.body;
    body.classList.remove('color-purple', 'color-blue', 'color-green', 'color-red');
    body.classList.add(`color-${colorScheme}`);
}

// Apply Font Size
function applyFontSize(fontSize) {
    const body = document.body;
    body.classList.remove('font-small', 'font-medium', 'font-large');
    body.classList.add(`font-${fontSize}`);
}

// Apply Settings to UI
function applySettingsToUI() {
    applyTheme(settingsState.appearance.theme);
    applyColorScheme(settingsState.appearance.colorScheme);
    applyFontSize(settingsState.appearance.fontSize);
}

// Save Settings
function saveSettings() {
    saveSettingsToStorage();
    
    // Show success message
    Swal.fire({
        icon: 'success',
        title: 'Settings Saved',
        text: 'Your settings have been saved successfully',
        timer: 2000,
        showConfirmButton: false
    });
}

// Export Data
function exportData() {
    try {
        // Collect all data
        const exportData = {
            settings: settingsState,
            tasks: tasks || [],
            categories: categories || [],
            tags: tags || [],
            userData: getUserData(),
            exportDate: new Date().toISOString()
        };

        // Create blob and download
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `task-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        Swal.fire({
            icon: 'success',
            title: 'Data Exported',
            text: 'Your data has been exported successfully',
            timer: 2000,
            showConfirmButton: false
        });
    } catch (error) {
        console.error('Export error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Export Failed',
            text: 'Failed to export data. Please try again.',
        });
    }
}

// Clear All Data
function clearAllData() {
    Swal.fire({
        title: 'Are you sure?',
        text: "This action cannot be undone. All your data will be permanently deleted.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff4444',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete all data',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // Clear all localStorage data
            localStorage.clear();
            
            // Reset settings to defaults
            settingsState = {
                appearance: {
                    theme: 'light',
                    colorScheme: 'purple',
                    fontSize: 'medium'
                },
                taskManagement: {
                    defaultPriority: 'Medium',
                    autoCategorize: false,
                    showCompleted: true
                },
                dataPrivacy: {
                    autoBackup: false,
                    exportFormat: 'json'
                },
                notifications: {
                    emailNotifications: true,
                    taskReminders: true,
                    weeklyReport: false
                }
            };

            // Clear tasks array
            if (typeof tasks !== 'undefined') {
                tasks = [];
                renderTasks();
            }

            // Reload page to reset everything
            setTimeout(() => {
                window.location.reload();
            }, 1000);

            Swal.fire({
                icon: 'success',
                title: 'Data Cleared',
                text: 'All data has been deleted successfully',
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}

// Enable Auto Backup
function enableAutoBackup() {
    // Set up periodic backup every 5 minutes
    if (window.backupInterval) {
        clearInterval(window.backupInterval);
    }
    
    window.backupInterval = setInterval(() => {
        const backupData = {
            settings: settingsState,
            tasks: tasks || [],
            categories: categories || [],
            tags: tags || [],
            backupDate: new Date().toISOString()
        };
        
        localStorage.setItem('autoBackup', JSON.stringify(backupData));
        console.log('Auto backup completed');
    }, 5 * 60 * 1000); // 5 minutes
}

// Disable Auto Backup
function disableAutoBackup() {
    if (window.backupInterval) {
        clearInterval(window.backupInterval);
        window.backupInterval = null;
    }
}

// Restore from Auto Backup
function restoreFromAutoBackup() {
    const backupData = localStorage.getItem('autoBackup');
    if (backupData) {
        try {
            const data = JSON.parse(backupData);
            
            // Restore settings
            if (data.settings) {
                settingsState = { ...settingsState, ...data.settings };
                applySettingsToUI();
            }
            
            // Restore tasks
            if (data.tasks && typeof tasks !== 'undefined') {
                tasks = data.tasks;
                renderTasks();
            }
            
            console.log('Auto backup restored');
        } catch (error) {
            console.error('Failed to restore from backup:', error);
        }
    }
}

// Settings Navigation
function showSettings() {
    // Hide all other sections
    const sections = ['main-1-top', 'task', 'categories-list', 'tage'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) section.style.display = 'none';
    });
    
    // Show settings section
    const settingsSection = document.getElementById('settings-section');
    if (settingsSection) {
        settingsSection.style.display = 'block';
    }
    
    // Update active state in sidebar
    const sidebarItems = document.querySelectorAll('.side a');
    sidebarItems.forEach(item => {
        item.style.background = 'none';
    });
    
    const settingsLink = document.querySelector('[onclick="showSettings()"]');
    if (settingsLink) {
        settingsLink.style.background = '#b3b1d326';
    }
}

// Add CSS for theme support
const settingsCSS = `
    /* Theme Support */
    .theme-dark {
        background-color: #1a1a1a;
        color: #ffffff;
    }
    
    .theme-dark .card,
    .theme-dark .settings-card {
        background-color: #2d2d2d;
        border-color: #404040;
    }
    
    .theme-dark .input-field,
    .theme-dark .setting-select {
        background-color: #404040;
        color: #ffffff;
        border-color: #555555;
    }
    
    /* Color Schemes */
    .color-purple {
        --primary-color: #8b5cf6;
        --secondary-color: #a78bfa;
    }
    
    .color-blue {
        --primary-color: #3b82f6;
        --secondary-color: #60a5fa;
    }
    
    .color-green {
        --primary-color: #10b981;
        --secondary-color: #34d399;
    }
    
    .color-red {
        --primary-color: #ef4444;
        --secondary-color: #f87171;
    }
    
    /* Font Sizes */
    .font-small {
        font-size: 14px;
    }
    
    .font-medium {
        font-size: 16px;
    }
    
    .font-large {
        font-size: 18px;
    }
    
    /* Settings specific styles */
    .settings-card {
        background: white;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .settings-header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .settings-header i {
        font-size: 20px;
        margin-right: 10px;
        color: var(--primary-color);
    }
    
    .settings-header h3 {
        margin: 0;
        font-size: 18px;
    }
    
    .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .setting-item label {
        font-weight: 500;
        color: #333;
    }
    
    .setting-select {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: white;
        min-width: 150px;
    }
    
    .toggle-switch {
        position: relative;
        width: 50px;
        height: 24px;
    }
    
    .toggle-input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 24px;
    }
    
    .toggle-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }
    
    .toggle-input:checked + .toggle-slider {
        background-color: var(--primary-color);
    }
    
    .toggle-input:checked + .toggle-slider:before {
        transform: translateX(26px);
    }
    
    .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }
    
    .btn-primary {
        background-color: var(--primary-color);
        color: white;
    }
    
    .btn-secondary {
        background-color: #6c757d;
        color: white;
    }
    
    .btn-danger {
        background-color: #dc3545;
        color: white;
    }
    
    .btn:hover {
        opacity: 0.9;
    }
`;

// Add settings CSS to document
const settingsStyleElement = document.createElement('style');
settingsStyleElement.textContent = settingsCSS;
document.head.appendChild(settingsStyleElement);

// Initialize settings when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeSettings();
    restoreFromAutoBackup();
});

// Export settings functions for global access
window.settingsFeature = {
    showSettings: showSettings,
    saveSettings: saveSettings,
    exportData: exportData,
    clearAllData: clearAllData,
    applyTheme: applyTheme,
    applyColorScheme: applyColorScheme
};
