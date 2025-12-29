document.querySelector(".login-form").addEventListener("submit", function (e) {
    e.preventDefault(); // stop page refresh

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Please fill all fields");
        return;
    }

    // 1. Get existing users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // 2. Check if user already exists
    let userExists = users.find(user => user.email === email);

    if (userExists) {
        alert("User already exists");
        return;
    }

    // 3. Create new user object
    let newUser = {
        email: email,
        password: password // ❌ not secure (for learning only)
    };

    // 4. Add user to array
    users.push(newUser);

    // 5. Save back to localStorage (ONE KEY)
    localStorage.setItem("users", JSON.stringify(users));

    alert("User saved successfully");

    // Clear inputs
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
});