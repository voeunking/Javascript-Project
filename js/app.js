// Categories Manager JavaScript

let categories = [];
const colors = ['blue', 'green', 'purple', 'red', 'yellow', 'indigo', 'pink', 'gray'];

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
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
        categories = categories.filter(cat => cat !== name);
        renderCategories();
        showMessage('Category deleted successfully', 'success');
    }
}

function renderCategories() {
    const categoriesList = document.getElementById('categoriesList');
    categoriesList.innerHTML = '';
    
    categories.forEach((category, index) => {
        const color = colors[index % colors.length];
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category-item';
        categoryElement.setAttribute('data-category', category);
        
        categoryElement.innerHTML = `
            <div class="category-info">
                <div class="category-dot ${color}"></div>
                <span class="category-name">${category}</span>
            </div>
            <div class="category-actions">
                <button onclick="editCategory('${category}')" class="btn-edit">Edit</button>
                <button onclick="deleteCategory('${category}')" class="btn-delete">Delete</button>
            </div>
        `;
        
        categoriesList.appendChild(categoryElement);
    });
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
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('categoryInput');
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addCategory();
        }
    });
    
    // Initialize categories display
    renderCategories();
});

// Add click handlers for navigation tabs
document.addEventListener('DOMContentLoaded', function() {
    const navTabs = document.querySelectorAll('.nav-tab');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            navTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
        });
    });
    
    // Add click handler for the main Add button
    const addBtn = document.querySelector('.add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            // Focus on the input field
            document.getElementById('categoryInput').focus();
        });
    }
});