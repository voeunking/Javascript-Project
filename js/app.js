// Profile
// function editProfile() {
//     document.getElementById("viewProfile").classList.add("hidden");
//     document.getElementById("editProfileForm").classList.remove("hidden");

// }

// function saveProfile() {
//     const name = document.getElementById("nameInput").value;
//     const email = document.getElementById("emailInput").value;
//     const password = document.getElementById("passwordInput").value;

//     document.getElementById("displayName").innerText = name;
//     document.getElementById("displayEmail").innerText = email;
//     document.getElementById("displayPassword").innerText = password;

//     document.getElementById("editProfileForm").classList.add("hidden");
//     document.getElementById("viewProfile").classList.remove("hidden");

// }

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
}
