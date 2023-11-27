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

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function logout() {
    try {
        // Add a confirmation dialog
        const confirmLogout = confirm("Are you sure you want to logout?");
        if (!confirmLogout) {
            return; // Do nothing if the user cancels the logout
        }

        // Make an asynchronous request to the server to log the user out
        const response = await fetch('/logout', { method: 'GET' });

        if (response.ok) {
            // Redirect the user to the login page or any other desired page
            window.location.href = 'Index.html';
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
}


function pageLoad() {
    // Add functionality for the window load event

    // Add event listener for the logout button
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (event) {
            event.preventDefault();
            logout();
        });
    } else {
        console.error("Element with ID 'logoutBtn' not found");
    }
}

// Ensure the DOM is fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
    checkCookie();
    pageLoad();
});
