function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function checkCookie() {
    console.log("Checking cookie...");
    var username = getCookie("username");
    console.log("Username from cookie:", username);
    if (!username) {
        console.log("Redirecting to login.html");
        window.location = "login.html";
    } else {
        console.log("Username found:", username);
        // Update the DOM with the username
        const usernameDisplay = document.getElementById("usernameDisplay");
        if (usernameDisplay) {
            usernameDisplay.innerText = "Welcome, " + username;
        } else {
            console.error("Element with ID 'usernameDisplay' not found");
        }
    }
}

function pageLoad() {
    // Add functionality for the window load event
}

// Ensure the DOM is fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
    checkCookie();
    pageLoad();
});
