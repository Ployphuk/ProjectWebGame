// Update your JavaScript file (leaderboardSetting.js)
function checkCookie() {
    console.log("Checking cookie...");
    var username = getCookie("username");
    console.log("Username from cookie:", username);
    if (!username) {
        console.log("Redirecting to login.html");
        window.location = "login.html";
    } else {
        
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }


 

// Update your JavaScript file (leaderboardSetting.js)
// Function to fetch and update leaderboard data
async function fetchfallLeaderboard() {
    try {
        // Fetch fall leaderboard data from the server
        const response = await fetch('/fallleaderboard');
        const leaderboardData = await response.json();

        // Clear existing leaderboard content
        const leaderboardContainer = document.getElementById('leaderboard');
        leaderboardContainer.innerHTML = '';

        // Iterate through the received data and update the leaderboard
        Object.values(leaderboardData).forEach((entry, index) => {
            const currentnum = index + 1;

            // Create a new row element
            const row = document.createElement('div');
            row.classList.add('row');

            // Create elements for leaderboard number, username, score, and like button
            const leaderboardNumber = document.createElement('div');
            leaderboardNumber.className = 'LeaderBoardNumber';
            row.appendChild(leaderboardNumber);

            const leaderboardText = document.createElement('h1');
            leaderboardText.className = 'LeaderBoardNumber' + currentnum;

            // Get username and fallgamescore from the entry
            const username = entry.username || 'N/A';
            const fallgamescore = entry.fallgamescore || 'N/A';

            // Set the text content for the leaderboard entry
            leaderboardText.innerHTML = `${username}  Score: ${fallgamescore}`;

            // Create a like button
            const likeButton = document.createElement('button');
            likeButton.innerHTML = 'Like';

            // Create a span element for displaying the like count
            const likeCountSpan = document.createElement('span');

            // Use localStorage to store and retrieve the like count
            const localStorageKey = `likeCount_${username}`;
            let storedLikeCount = localStorage.getItem(localStorageKey);
            likeCountSpan.innerHTML = storedLikeCount || '0'; // Use the stored like count or default to 0

            likeButton.appendChild(likeCountSpan);

            // Add a click event listener to the like button
            likeButton.addEventListener('click', async () => {
                try {
                    // Increment the like count on the front-end
                    const updatedLikeCount = parseInt(likeCountSpan.innerHTML) + 1;
                    likeCountSpan.innerHTML = updatedLikeCount;

                    // Store the updated like count in localStorage
                    localStorage.setItem(localStorageKey, updatedLikeCount);

                    // Send a request to the server to update the like count in the database
                    await fetch('/like', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, updatedLikeCount }),
                    });
                } catch (error) {
                    console.error('Error updating like count:', error);
                }
            });

            // Append elements to the row
            leaderboardNumber.appendChild(leaderboardText);
            leaderboardNumber.appendChild(likeButton);

            // Append the row to the leaderboard container
            leaderboardContainer.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching and updating leaderboard:', error);
    }
}



  
 // Add a function to post comments
async function postComment() {
    try {
        // Get the comment text from the textarea
        const commentText = document.getElementById('textmsg').value;

        // Make sure the comment is not empty
        if (commentText.trim() === '') {
            alert('Please enter a comment before posting.');
            return;
        }

        // Send the comment to the server
        const response = await fetch('/submitComment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ commentText }),
        });

        if (response.ok) {
            // If the server successfully handles the comment, fetch and update the comments
            fetchComments();
            // Clear the textarea after posting
            document.getElementById('textmsg').value = '';
        } else {
            console.error('Failed to submit comment to server.');
        }
    } catch (error) {
        console.error('Error posting comment:', error);
    }
}

// Add a function to fetch and update comments
async function fetchComments() {
    try {
        const response = await fetch('/getComments');
        const commentsData = await response.json();

        const feedContainer = document.getElementById('feed-container');
        feedContainer.innerHTML = '';

        commentsData.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `<p>${comment.username}: ${comment.commentText}</p>`;
            feedContainer.appendChild(commentElement);
        });
    } catch (error) {
        console.error('Error fetching and updating comments:', error);
    }
}

// Ensure the DOM is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function () {
    checkCookie();
    fetchfallLeaderboard();
    fetchComments(); // Fetch and update comments when the page loads
});

  



  

