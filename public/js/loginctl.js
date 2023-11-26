window.onload = pageLoad;

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");

    if (error === "1") {
        alert("Invalid username or password. Please try again.");
    }
});