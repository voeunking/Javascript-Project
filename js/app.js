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
let show_profile = document.getElementById('setting');
let active = document.getElementById('active');
let chart = document.getElementById('chart');
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
})

// Tage
let tage = document.getElementById('tag');
tage.addEventListener('click', function () {

    show_tage.style.display = 'block';
    main_1_top.style.display = 'none';
    show_task.style.display = 'none';
    tage.style.background = '#b3b1d326';
    active.style.background = 'none';
    taskss.style.background = 'none';
    show_categories.style.background = 'none';
    categoriesList.style.display = 'none';
    chart.style.display = 'none';
    
    // Initialize tags display
    initializeTags();
})
// task
let taskss = document.getElementById('tasks');
taskss.addEventListener('click', function () {
    show_task.style.display = 'block'
    main_1_top.style.display = 'none';
    show_tage.style.display = 'none'
    taskss.style.background = '#b3b1d326';
    active.style.background = 'none';
    tage.style.background = 'none';
    show_categories.style.background = 'none';
    categoriesList.style.display = 'none';
    chart.style.display = 'none';

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
    chart.style.display = 'none';

})

// function task


let tasks = JSON.parse(localStorage.getItem('tasks')) || [
    { title: "Finish report", category: "Work", priority: "High", status: "Pending", createdAt: new Date().toISOString() },
    { title: "Team meeting", category: "Work", priority: "Medium", status: "Pending", createdAt: new Date().toISOString() },
    { title: "Grocery shopping", category: "Personal", priority: "Low", status: "Pending", createdAt: new Date().toISOString() },
    { title: "Study JavaScript", category: "Study", priority: "High", status: "Completed", createdAt: new Date().toISOString() },
    { title: "Project presentation", category: "Work", priority: "High", status: "Completed", createdAt: new Date().toISOString() },
    { title: "Gym workout", category: "Personal", priority: "Medium", status: "Pending", createdAt: new Date().toISOString() },
    { title: "Read documentation", category: "Study", priority: "Medium", status: "Pending", createdAt: new Date().toISOString() }
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
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Task Title:</label>
                    <input id="swal-title" class="swal2-input" placeholder="Enter task title">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Category:</label>
                    <select id="swal-category" class="swal2-select">
                        <option value="">Select category</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Study">Study</option>
                        ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                    </select>
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Priority:</label>
                    <select id="swal-priority" class="swal2-select">
                        <option value="">Select priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Status:</label>
                    <select id="swal-status" class="swal2-select">
                        <option value="">Select status</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Tags (comma separated):</label>
                    <input id="swal-tags" class="swal2-input" placeholder="e.g., urgent, important, review">
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
